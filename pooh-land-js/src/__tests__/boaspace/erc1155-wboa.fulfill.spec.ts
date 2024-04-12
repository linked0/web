import { providers } from "@0xsequence/multicall";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import sinon from "sinon";
import { ItemType, MAX_INT, OrderType } from "../../constants";
import {
  AssetContractShared,
  SharedStorefrontLazyMintAdapter,
  WBOA9,
} from "../../typechain";
import { CreateOrderInput, CurrencyItem } from "../../types";
import * as fulfill from "../../utils/fulfill";
import {
  getBalancesForFulfillOrder,
  verifyBalancesAfterFulfill,
} from "../utils/balance";
import {describeWithContractsCreation, describeWithFixture} from "../utils/setup";
import { createTokenId } from "../../utils/parseTokenId";

describeWithContractsCreation(
  "Buying multiple listings or accepting multiple offers through SharedStorefrontLazyMintAdapter",
  (fixture) => {
    let offerer: SignerWithAddress;
    let zone: SignerWithAddress;
    let fulfiller: SignerWithAddress;
    let admin: SignerWithAddress;
    let multicallProvider: providers.MulticallProvider;
    let standardCreateOrderInput: CreateOrderInput;
    let fulfillStandardOrderSpy: sinon.SinonSpy;

    let tokenId: BigNumber;
    const assetTokenAmount = "10";

    const BOASPACE_DOMAIN = "boaspace.io";
    const BOASPACE_TAG = "7f688786";

    const ZeroAddress = "0x0000000000000000000000000000000000000000";

    let assetToken: AssetContractShared;
    let lazyMintAdapter: SharedStorefrontLazyMintAdapter;
    let wboaToken: WBOA9;

    beforeEach(async () => {
      const { seaport } = fixture;

      fulfillStandardOrderSpy = sinon.spy(fulfill, "fulfillStandardOrder");

      [offerer, zone, fulfiller, admin] = await ethers.getSigners();
      multicallProvider = new providers.MulticallProvider(ethers.provider);

      console.log("offerer:", offerer.address);
      console.log("fulfiller:", fulfiller.address);

      // Deploy WBOA9 contract
      const wboa9Factory = await ethers.getContractFactory("WBOA9");
      wboaToken = (await wboa9Factory.connect(admin).deploy()) as WBOA9;

      // Deploy AssetContractShared contract
      const name = "BOASPACE Collections";
      const symbol = "BOASPACESTORE";
      const templateURI = "";
      const assetTokenFactory = await ethers.getContractFactory(
          "AssetContractShared"
      );
      assetToken = (await assetTokenFactory
          .connect(admin)
          .deploy(
              name,
              symbol,
              ethers.constants.AddressZero,
              templateURI,
              ethers.constants.AddressZero
          )) as AssetContractShared;
      await assetToken.deployed();

      // Deploy SharedStorefrontLazyMintAdapter contract
      const lazyMintAdapterFactory = await ethers.getContractFactory(
          "SharedStorefrontLazyMintAdapter"
      );
      lazyMintAdapter = (await lazyMintAdapterFactory
          .connect(admin)
          .deploy(
            seaport.contract.address,
              ZeroAddress,
              assetToken.address
          )) as SharedStorefrontLazyMintAdapter;

      // set the shared proxy of assetToken to SharedStorefrontLazyMintAdapter
      await assetToken.connect(admin).addSharedProxyAddress(lazyMintAdapter.address);
    });

    afterEach(() => {
      fulfillStandardOrderSpy.restore();
    });

    describe("[Accept offer] I want to accept a partial offer for my AssetContractShared", async () => {
      beforeEach(async () => {
        const { seaport } = fixture;

        // Deposit BOA from offerer to WBOA
        await wboaToken
          .connect(offerer)
          .deposit({ value: parseEther("20").toString() });
      });

      it("Offer: WBOA9(ERC20) <=> AssetContractShared", async () => {
        const { seaport } = fixture;

        // mint AssetContractShared
        const creatorContract = assetToken.connect(fulfiller);
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);
        const data =
          "https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7";
        const buffer = ethers.utils.toUtf8Bytes(data);

        tokenId = createTokenId(fulfiller.address, tokenIndex, tokenQuantity);
        console.log(
          "Combined tokenId: %s (%s)",
          tokenId.toString(),
          tokenId.toHexString()
        );
        await creatorContract.mint(
          fulfiller.address,
          tokenId,
          tokenQuantity,
          buffer
        );
        console.log("Token minted to:", fulfiller.address);

        console.log(
          "fulfiller: ",
          await assetToken.balanceOf(fulfiller.address, tokenId)
        );

        // create an order
        standardCreateOrderInput = {
          allowPartialFills: true,

          offer: [
            {
              amount: parseEther("10").toString(),
              token: wboaToken.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: lazyMintAdapter.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString(),
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        const { executeAllActions } = await seaport.createOrder(
          standardCreateOrderInput,
          offerer.address
        );

        const order = await executeAllActions();

        expect(order.parameters.orderType).eq(OrderType.PARTIAL_OPEN);

        const orderStatus = await seaport.getOrderStatus(
          seaport.getOrderHash(order.parameters)
        );

        const ownerToTokenToIdentifierBalances =
          await getBalancesForFulfillOrder(
            order,
            fulfiller.address,
            multicallProvider
          );

        const { actions } = await seaport.fulfillOrder({
          order,
          unitsToFill: 2,
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        // approve to SharedStorefrontLazyMintAdapter
        await assetToken
          .connect(fulfiller)
          .setApprovalForAll(lazyMintAdapter.address, true);
        expect(
          await assetToken.isApprovedForAll(
            fulfiller.address,
            lazyMintAdapter.address
          )
        ).to.be.true;

        // We also need to approve ERC-20 as we send that out as fees..
        const approvalAction = actions[0];
        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: wboaToken.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();
        expect(
          await wboaToken.allowance(fulfiller.address, seaport.contract.address)
        ).to.eq(MAX_INT);

        const fulfillAction = actions[1];
        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        const transaction = await fulfillAction.transactionMethods.transact();
        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);
        const receipt = await transaction.wait();

        const offererAssetTokenBalance = await assetToken.balanceOf(
          offerer.address,
          tokenId
        );
        const fulfillerAssetTokenBalance = await assetToken.balanceOf(
          fulfiller.address,
          tokenId
        );
        expect(offererAssetTokenBalance).eq(BigNumber.from(2));
        expect(fulfillerAssetTokenBalance).eq(BigNumber.from(98));

        await verifyBalancesAfterFulfill({
          ownerToTokenToIdentifierBalances,
          order,
          orderStatus,
          unitsToFill: 2,
          fulfillerAddress: fulfiller.address,
          multicallProvider,
          fulfillReceipt: receipt,
        });

        // Double check nft balances
        expect(fulfillStandardOrderSpy).calledOnce;
      });

      it("Offer: WBOA9(ERC20) <=> AssetContractShared with lazy-minting", async () => {
        const { seaport } = fixture;

        // new tokenId for AssetContractShared
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);

        tokenId = createTokenId(fulfiller.address, tokenIndex, tokenQuantity);
        console.log(
          "Combined tokenId: %s (%s)",
          tokenId.toString(),
          tokenId.toHexString()
        );

        console.log(
          "fulfiller: ",
          await assetToken.balanceOf(fulfiller.address, tokenId)
        );


        // create an order
        standardCreateOrderInput = {
          allowPartialFills: true,

          offer: [
            {
              amount: parseEther("10").toString(),
              token: wboaToken.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: lazyMintAdapter.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString(),
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        const { executeAllActions } = await seaport.createOrder(
          standardCreateOrderInput,
          offerer.address
        );

        const order = await executeAllActions();

        expect(order.parameters.orderType).eq(OrderType.PARTIAL_OPEN);

        const orderStatus = await seaport.getOrderStatus(
          seaport.getOrderHash(order.parameters)
        );

        const ownerToTokenToIdentifierBalances =
          await getBalancesForFulfillOrder(
            order,
            fulfiller.address,
            multicallProvider
          );

        const { actions } = await seaport.fulfillOrder({
          order,
          unitsToFill: 2,
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        // approve to SharedStorefrontLazyMintAdapter
        await assetToken
          .connect(fulfiller)
          .setApprovalForAll(lazyMintAdapter.address, true);
        expect(
          await assetToken.isApprovedForAll(
            fulfiller.address,
            lazyMintAdapter.address
          )
        ).to.be.true;

        // We also need to approve ERC-20 as we send that out as fees..
        const approvalAction = actions[0];
        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: wboaToken.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();
        expect(
          await wboaToken.allowance(fulfiller.address, seaport.contract.address)
        ).to.eq(MAX_INT);

        const fulfillAction = actions[1];
        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        const transaction = await fulfillAction.transactionMethods.transact();
        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);
        const receipt = await transaction.wait();

        const offererAssetTokenBalance = await assetToken.balanceOf(
          offerer.address,
          tokenId
        );
        const fulfillerAssetTokenBalance = await assetToken.balanceOf(
          fulfiller.address,
          tokenId
        );
        expect(offererAssetTokenBalance).eq(BigNumber.from(2));
        expect(fulfillerAssetTokenBalance).eq(BigNumber.from(98));

        await verifyBalancesAfterFulfill({
          ownerToTokenToIdentifierBalances,
          order,
          orderStatus,
          unitsToFill: 2,
          fulfillerAddress: fulfiller.address,
          multicallProvider,
          fulfillReceipt: receipt,
        });

        // Double check nft balances
        expect(fulfillStandardOrderSpy).calledOnce;
      });
    });

    describe("Accept listing] I want to accept a partial offer for the seller's AssetContractShared", async () => {
      beforeEach(async () => {
        const { seaport } = fixture;
        console.log("seaport:", seaport.contract.address);

        // Deposit BOA from offerer to WBOA
        await wboaToken
          .connect(fulfiller)
          .deposit({ value: parseEther("20").toString() });
      });

      it("Listing: AssetContractShared <=> WBOA9(ERC20)", async () => {
        const { seaport } = fixture;

        // mint AssetContractShared
        const creatorContract = assetToken.connect(offerer);
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);
        const data =
          "https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7";
        const buffer = ethers.utils.toUtf8Bytes(data);

        tokenId = createTokenId(offerer.address, tokenIndex, tokenQuantity);
        console.log(
          "Combined tokenId: %s (%s)",
          tokenId.toString(),
          tokenId.toHexString()
        );
        await creatorContract.mint(
          offerer.address,
          tokenId,
          tokenQuantity,
          buffer
        );
        console.log("Token minted to:", offerer.address);

        console.log(
          "offerer: ",
          await assetToken.balanceOf(offerer.address, tokenId)
        );

        // create an order
        standardCreateOrderInput = {
          allowPartialFills: true,

          offer: [
            {
              itemType: ItemType.ERC1155,
              token: lazyMintAdapter.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString()
            }
          ],
          consideration: [
            {
              amount: parseEther("10").toString(),
              token: wboaToken.address,
              recipient: offerer.address,
            }
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250}],
        };

        const { executeAllActions } = await seaport.createOrder(
          standardCreateOrderInput,
          offerer.address
        );

        const order = await executeAllActions();

        expect(order.parameters.orderType).eq(OrderType.PARTIAL_OPEN);

        const orderStatus = await seaport.getOrderStatus(
          seaport.getOrderHash(order.parameters)
        );

        const ownerToTokenToIdentifierBalances =
          await getBalancesForFulfillOrder(
            order,
            fulfiller.address,
            multicallProvider
          );

        const { actions } = await seaport.fulfillOrder({
          order,
          unitsToFill: 2,
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        // approve to SharedStorefrontLazyMintAdapter
        await assetToken
          .connect(offerer)
          .setApprovalForAll(lazyMintAdapter.address, true);
        expect(
          await assetToken.isApprovedForAll(
            offerer.address,
            lazyMintAdapter.address
          )
        ).to.be.true;

        // We also need to approve ERC-20 as we send that out as fees..
        const approvalAction = actions[0];
        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: wboaToken.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();
        expect(
          await wboaToken.allowance(fulfiller.address, seaport.contract.address)
        ).to.eq(MAX_INT);

        const fulfillAction = actions[1];
        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        const transaction = await fulfillAction.transactionMethods.transact();
        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);
        const receipt = await transaction.wait();

        const offererAssetTokenBalance = await assetToken.balanceOf(
          offerer.address,
          tokenId
        );
        const fulfillerAssetTokenBalance = await assetToken.balanceOf(
          fulfiller.address,
          tokenId
        );
        expect(offererAssetTokenBalance).eq(BigNumber.from(98));
        expect(fulfillerAssetTokenBalance).eq(BigNumber.from(2));

        await verifyBalancesAfterFulfill({
          ownerToTokenToIdentifierBalances,
          order,
          orderStatus,
          unitsToFill: 2,
          fulfillerAddress: fulfiller.address,
          multicallProvider,
          fulfillReceipt: receipt,
        });

        // Double check nft balances
        expect(fulfillStandardOrderSpy).calledOnce;
      });

      it("Listing: AssetContractShared <=> WBOA9(ERC20) with lazy-minting", async () => {
        const { seaport } = fixture;

        // new tokenId for AssetContractShared
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);

        tokenId = createTokenId(offerer.address, tokenIndex, tokenQuantity);
        console.log(
          "Combined tokenId: %s (%s)",
          tokenId.toString(),
          tokenId.toHexString()
        );

        console.log(
          "offerer: ",
          await assetToken.balanceOf(offerer.address, tokenId)
        );

        // create an order
        standardCreateOrderInput = {
          allowPartialFills: true,

          offer: [
            {
              itemType: ItemType.ERC1155,
              token: lazyMintAdapter.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString()
            }
          ],
          consideration: [
            {
              amount: parseEther("10").toString(),
              token: wboaToken.address,
              recipient: offerer.address,
            }
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250}],
        };

        const { executeAllActions } = await seaport.createOrder(
          standardCreateOrderInput,
          offerer.address
        );

        const order = await executeAllActions();

        expect(order.parameters.orderType).eq(OrderType.PARTIAL_OPEN);

        const orderStatus = await seaport.getOrderStatus(
          seaport.getOrderHash(order.parameters)
        );

        const ownerToTokenToIdentifierBalances =
          await getBalancesForFulfillOrder(
            order,
            fulfiller.address,
            multicallProvider
          );

        const { actions } = await seaport.fulfillOrder({
          order,
          unitsToFill: 2,
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        // approve to SharedStorefrontLazyMintAdapter
        await assetToken
          .connect(offerer)
          .setApprovalForAll(lazyMintAdapter.address, true);
        expect(
          await assetToken.isApprovedForAll(
            offerer.address,
            lazyMintAdapter.address
          )
        ).to.be.true;

        // We also need to approve ERC-20 as we send that out as fees..
        const approvalAction = actions[0];
        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: wboaToken.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();
        expect(
          await wboaToken.allowance(fulfiller.address, seaport.contract.address)
        ).to.eq(MAX_INT);

        const fulfillAction = actions[1];
        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        const transaction = await fulfillAction.transactionMethods.transact();
        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);
        const receipt = await transaction.wait();

        const offererAssetTokenBalance = await assetToken.balanceOf(
          offerer.address,
          tokenId
        );
        const fulfillerAssetTokenBalance = await assetToken.balanceOf(
          fulfiller.address,
          tokenId
        );
        expect(offererAssetTokenBalance).eq(BigNumber.from(98));
        expect(fulfillerAssetTokenBalance).eq(BigNumber.from(2));

        await verifyBalancesAfterFulfill({
          ownerToTokenToIdentifierBalances,
          order,
          orderStatus,
          unitsToFill: 2,
          fulfillerAddress: fulfiller.address,
          multicallProvider,
          fulfillReceipt: receipt,
        });

        // Double check nft balances
        expect(fulfillStandardOrderSpy).calledOnce;
      });
    });
  }
);
