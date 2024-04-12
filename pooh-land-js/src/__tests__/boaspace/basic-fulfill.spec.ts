import * as dotenv from "dotenv";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import sinon from "sinon";
import { ItemType, MAX_INT } from "../../constants";
import {
  TestERC1155,
  TestERC721,
  AssetContractShared,
  SharedStorefrontLazyMintAdapter,
  SharedStorefrontLazyMintAdapter__factory,
} from "../../typechain";
import { CreateOrderInput, CurrencyItem } from "../../types";
import * as fulfill from "../../utils/fulfill";
import { describeWithFixture } from "../utils/setup";
import { createTokenId } from "../../utils/parseTokenId";

describeWithFixture(
  "As a user I want to buy multiple listings or accept multiple offers",
  (fixture) => {
    let offerer: SignerWithAddress;
    let secondOfferer: SignerWithAddress;
    let zone: SignerWithAddress;
    let fulfiller: SignerWithAddress;
    let admin: SignerWithAddress;
    let firstStandardCreateOrderInput: CreateOrderInput;
    let secondStandardCreateOrderInput: CreateOrderInput;
    let thirdStandardCreateOrderInput: CreateOrderInput;
    let fourthStandardCreateOrderInput: CreateOrderInput;
    let fulfillAvailableOrdersSpy: sinon.SinonSpy;
    let secondTestErc721: TestERC721;
    let secondTestErc1155: TestERC1155;

    const nftId = "1";
    const nftId2 = "2";
    let tokenId: BigNumber;
    const erc1155Amount = "3";
    const erc1155Amount2 = "7";
    const assetTokenAmount = "10";

    const BOASPACE_DOMAIN = "boaspace.io";
    const BOASPACE_TAG = "7f688786";

    const ZeroAddress = "0x0000000000000000000000000000000000000000";

    let assetToken: AssetContractShared;
    let lazyMintAdapter: SharedStorefrontLazyMintAdapter;

    dotenv.config({ path: "env/.env" });

    beforeEach(async () => {
      const { seaport, testErc1155, testErc20 } = fixture;
      const { provider } = waffle;

      fulfillAvailableOrdersSpy = sinon.spy(fulfill, "fulfillAvailableOrders");

      [offerer, secondOfferer, zone, fulfiller, admin] =
        await ethers.getSigners();

      const TestERC1155 = await ethers.getContractFactory("TestERC1155");
      secondTestErc1155 = await TestERC1155.deploy();
      await secondTestErc1155.deployed();

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
      console.log("AssetContractShared:", assetToken.address);

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
      console.log("SharedStorefrontLazyMintAdapter:", lazyMintAdapter.address);
    });

    afterEach(() => {
      fulfillAvailableOrdersSpy.restore();
    });

    describe("[Accept offer] I want to accept three ERC1155 offers using AssetContractShared", async () => {
      beforeEach(async () => {
        const { seaport, testErc1155, testErc20 } = fixture;

        console.log("testErc1155:", testErc1155.address);
        console.log("testErc20:", testErc20.address);
        console.log("seaport:", seaport.contract.address);

        // mint TestERC1155
        await testErc1155.mint(fulfiller.address, nftId, erc1155Amount);
        await testErc1155.mint(fulfiller.address, nftId, erc1155Amount2);
        await secondTestErc1155.mint(fulfiller.address, nftId, erc1155Amount);

        // mint AssetContractShared
        const creatorContract = assetToken.connect(fulfiller);
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);
        const data = "https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7";
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

        await testErc20.mint(offerer.address, parseEther("20").toString());
        await testErc20.mint(
          secondOfferer.address,
          parseEther("20").toString()
        );

        firstStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: testErc1155.address,
              amount: erc1155Amount,
              identifier: nftId,
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        secondStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: testErc1155.address,
              amount: erc1155Amount2,
              identifier: nftId,
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        thirdStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: secondTestErc1155.address,
              amount: erc1155Amount,
              identifier: nftId,
              recipient: secondOfferer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        fourthStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: assetToken.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString(),
              recipient: secondOfferer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };
      });

      it("ERC20 <=> ERC1155", async () => {
        const { seaport, testErc1155, testErc20 } = fixture;

        const firstOrderUseCase = await seaport.createOrder(
          firstStandardCreateOrderInput
        );

        const firstOrder = await firstOrderUseCase.executeAllActions();

        const secondOrderUseCase = await seaport.createOrder(
          secondStandardCreateOrderInput
        );

        const secondOrder = await secondOrderUseCase.executeAllActions();

        const thirdOrderUseCase = await seaport.createOrder(
          thirdStandardCreateOrderInput,
          secondOfferer.address
        );

        const thirdOrder = await thirdOrderUseCase.executeAllActions();

        const fourthOrderUseCase = await seaport.createOrder(
          fourthStandardCreateOrderInput,
          secondOfferer.address
        );

        const fourthOrder = await fourthOrderUseCase.executeAllActions();

        const { actions } = await seaport.fulfillOrders({
          fulfillOrderDetails: [
            { order: firstOrder },
            { order: secondOrder },
            { order: thirdOrder },
            { order: fourthOrder },
          ],
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        const approvalAction = actions[0];

        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: testErc1155.address,
          identifierOrCriteria: nftId,
          itemType: ItemType.ERC1155,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();

        expect(
          await testErc1155.isApprovedForAll(
            fulfiller.address,
            seaport.contract.address
          )
        ).to.be.true;

        const secondApprovalAction = actions[1];

        expect(secondApprovalAction).to.deep.equal({
          type: "approval",
          token: testErc20.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: secondApprovalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await secondApprovalAction.transactionMethods.transact();

        expect(
          await testErc20.allowance(fulfiller.address, seaport.contract.address)
        ).eq(MAX_INT);

        const thirdApprovalAction = actions[2];

        expect(thirdApprovalAction).to.deep.equal({
          type: "approval",
          token: secondTestErc1155.address,
          identifierOrCriteria: nftId,
          itemType: ItemType.ERC1155,
          transactionMethods: thirdApprovalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await thirdApprovalAction.transactionMethods.transact();

        expect(
          await secondTestErc1155.isApprovedForAll(
            fulfiller.address,
            seaport.contract.address
          )
        ).to.be.true;

        const fourthApprovalAction = actions[3];

        expect(fourthApprovalAction).to.deep.equal({
          type: "approval",
          token: assetToken.address,
          identifierOrCriteria: tokenId.toString(),
          itemType: ItemType.ERC1155,
          transactionMethods: fourthApprovalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await fourthApprovalAction.transactionMethods.transact();

        expect(
          await assetToken.isApprovedForAll(
            fulfiller.address,
            seaport.contract.address
          )
        ).to.be.true;

        const fulfillAction = actions[4];

        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        expect(
          (
            await fulfillAction.transactionMethods.buildTransaction()
          ).data?.slice(-8)
        ).to.eq(BOASPACE_TAG);

        const transaction = await fulfillAction.transactionMethods.transact();

        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);

        const balances = await Promise.all([
          testErc1155.balanceOf(offerer.address, nftId),
          secondTestErc1155.balanceOf(secondOfferer.address, nftId),
          assetToken.balanceOf(secondOfferer.address, tokenId),
        ]);

        expect(balances[0]).to.equal(BigNumber.from(10));
        expect(balances[1]).to.equal(BigNumber.from(erc1155Amount));
        expect(balances[2]).to.equal(BigNumber.from(assetTokenAmount));

        expect(fulfillAvailableOrdersSpy).calledOnce;
      });
    });

    describe("[Accept offer] Three ERC1155 offers using SharedStorefrontLazyMintAdapter", async () => {
      beforeEach(async () => {
        const { seaport, testErc1155, testErc20 } = fixture;

        console.log("testErc1155:", testErc1155.address);
        console.log("testErc20:", testErc20.address);
        console.log("seaport:", seaport.contract.address);

        // mint TestERC1155
        await testErc1155.mint(fulfiller.address, nftId, erc1155Amount);
        await testErc1155.mint(fulfiller.address, nftId, erc1155Amount2);
        await secondTestErc1155.mint(fulfiller.address, nftId, erc1155Amount);

        // mint AssetContractShared
        const creatorContract = assetToken.connect(fulfiller);
        const tokenQuantity = 100;
        const tokenIndex = BigNumber.from(1);
        const data = "https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7";
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

        await testErc20.mint(offerer.address, parseEther("20").toString());
        await testErc20.mint(
          secondOfferer.address,
          parseEther("20").toString()
        );

        firstStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: testErc1155.address,
              amount: erc1155Amount,
              identifier: nftId,
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        secondStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: testErc1155.address,
              amount: erc1155Amount2,
              identifier: nftId,
              recipient: offerer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        thirdStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: secondTestErc1155.address,
              amount: erc1155Amount,
              identifier: nftId,
              recipient: secondOfferer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };

        fourthStandardCreateOrderInput = {
          offer: [
            {
              amount: parseEther("10").toString(),
              token: testErc20.address,
            },
          ],
          consideration: [
            {
              itemType: ItemType.ERC1155,
              token: lazyMintAdapter.address,
              amount: assetTokenAmount,
              identifier: tokenId.toString(),
              recipient: secondOfferer.address,
            },
          ],
          // 2.5% fee
          fees: [{ recipient: zone.address, basisPoints: 250 }],
        };
      });

      it("ERC20 <=> ERC1155", async () => {
        const { seaport, testErc1155, testErc20 } = fixture;

        const firstOrderUseCase = await seaport.createOrder(
          firstStandardCreateOrderInput
        );

        const firstOrder = await firstOrderUseCase.executeAllActions();

        const secondOrderUseCase = await seaport.createOrder(
          secondStandardCreateOrderInput
        );

        const secondOrder = await secondOrderUseCase.executeAllActions();

        const thirdOrderUseCase = await seaport.createOrder(
          thirdStandardCreateOrderInput,
          secondOfferer.address
        );

        const thirdOrder = await thirdOrderUseCase.executeAllActions();

        const fourthOrderUseCase = await seaport.createOrder(
          fourthStandardCreateOrderInput,
          secondOfferer.address
        );

        const fourthOrder = await fourthOrderUseCase.executeAllActions();

        const { actions } = await seaport.fulfillOrders({
          fulfillOrderDetails: [
            { order: firstOrder },
            { order: secondOrder },
            { order: thirdOrder },
            { order: fourthOrder },
          ],
          accountAddress: fulfiller.address,
          domain: BOASPACE_DOMAIN,
        });

        const approvalAction = actions[0];

        expect(approvalAction).to.deep.equal({
          type: "approval",
          token: testErc1155.address,
          identifierOrCriteria: nftId,
          itemType: ItemType.ERC1155,
          transactionMethods: approvalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await approvalAction.transactionMethods.transact();

        expect(
          await testErc1155.isApprovedForAll(
            fulfiller.address,
            seaport.contract.address
          )
        ).to.be.true;

        const secondApprovalAction = actions[1];

        expect(secondApprovalAction).to.deep.equal({
          type: "approval",
          token: testErc20.address,
          identifierOrCriteria: "0",
          itemType: ItemType.ERC20,
          transactionMethods: secondApprovalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await secondApprovalAction.transactionMethods.transact();

        expect(
          await testErc20.allowance(fulfiller.address, seaport.contract.address)
        ).eq(MAX_INT);

        const thirdApprovalAction = actions[2];

        expect(thirdApprovalAction).to.deep.equal({
          type: "approval",
          token: secondTestErc1155.address,
          identifierOrCriteria: nftId,
          itemType: ItemType.ERC1155,
          transactionMethods: thirdApprovalAction.transactionMethods,
          operator: seaport.contract.address,
        });

        await thirdApprovalAction.transactionMethods.transact();

        expect(
          await secondTestErc1155.isApprovedForAll(
            fulfiller.address,
            seaport.contract.address
          )
        ).to.be.true;

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

        const fulfillAction = actions[3];

        expect(fulfillAction).to.be.deep.equal({
          type: "exchange",
          transactionMethods: fulfillAction.transactionMethods,
        });

        expect(
          (
            await fulfillAction.transactionMethods.buildTransaction()
          ).data?.slice(-8)
        ).to.eq(BOASPACE_TAG);

        const transaction = await fulfillAction.transactionMethods.transact();

        expect(transaction.data.slice(-8)).to.eq(BOASPACE_TAG);

        const balances = await Promise.all([
          testErc1155.balanceOf(offerer.address, nftId),
          secondTestErc1155.balanceOf(secondOfferer.address, nftId),
          assetToken.balanceOf(secondOfferer.address, tokenId),
        ]);

        expect(balances[0]).to.equal(BigNumber.from(10));
        expect(balances[1]).to.equal(BigNumber.from(erc1155Amount));
        expect(balances[2]).to.equal(BigNumber.from(assetTokenAmount));

        expect(fulfillAvailableOrdersSpy).calledOnce;
      });
    });
  }
);
