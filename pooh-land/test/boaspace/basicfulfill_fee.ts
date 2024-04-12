import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import { faucet } from "../utils/faucet";
import type {
    AssetContractShared,
    AssetContractShared__factory as AssetContractSharedFactory,
    ConduitController,
    ConduitController__factory as ConduitControllerFactory,
    Conduit,
    BoaFeeCollector__factory as BoaFeeCollectorFactory,
    BoaFeeCollector,
    UpgradeBeacon__factory as UngradeBeaconFactory,
    UpgradeBeacon,
    PayableProxy__factory as PayableProxyFactory,
    PayableProxy,
    Seaport,
    Seaport__factory as SeaportFactory,
    SharedStorefrontLazyMintAdapter,
    SharedStorefrontLazyMintAdapter__factory as SharedStorefrontLazyMintAdapterFactory,
    WETH__factory as WETHFactory,
    WETH,
} from "../../typechain-types";
import { createOrder, setSeaport } from "../../utils/CommonFunctions";
import { createTokenId } from "../../utils/ParseTokenID";
import { BigNumber, BigNumberish } from "ethers";
import { getItemETH, toBN, toKey } from "../utils/encoding";
import type { ConsiderationItem, OfferItem } from "../utils/types";
const { parseEther } = ethers.utils;

const ZeroAddress = "0x0000000000000000000000000000000000000000";

/**
 * Accept offer for a single or ERC1155 in exchange for BOA
 */
describe(`Fulfilling a basic order offering NFT and getting BOA(BOASPACE)`, function () {
    const { provider } = waffle;

    const [admin, owner, feeAdmin, offerer, fulfiller, user] = provider.getWallets();
    const adminSigner = provider.getSigner(admin.address);
    const ownerSigner = provider.getSigner(owner.address);
    const fulfillerSigner = provider.getSigner(fulfiller.address);

    let assetToken: AssetContractShared;
    let conduitController: ConduitController;
    let marketplace: Seaport;
    let lazymintAdapter: SharedStorefrontLazyMintAdapter;

    let wboaContract: WETH;
    let feeCollectorContract: BoaFeeCollector;
    let beaconContract: UpgradeBeacon;
    let proxyContract: PayableProxy;

    let tokenId: BigNumber;
    let tokenQuantity: number;

    before(async () => {
        await faucet(admin.address, provider);
        await faucet(offerer.address, provider);
        await faucet(fulfiller.address, provider);

        console.log("admin: ", admin.address);
        console.log("offerer: ", offerer.address);
        console.log("fulfiller: ", fulfiller.address);

        console.log("admin balance: ", await provider.getBalance(admin.address));
        console.log("offerer balance: ", await provider.getBalance(offerer.address));
        console.log("fulfiller balance: ", await provider.getBalance(fulfiller.address));

        // Deploy AssetContractShared contract
        const name = "BOASPACE Collections";
        const symbol = "BOASPACESTORE";
        const templateURI = "";

        const assetTokenFactory = await ethers.getContractFactory("AssetContractShared");
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

        // Deploy ConduitController contract
        const conduitControllerFactory = await ethers.getContractFactory("ConduitController");
        conduitController = await conduitControllerFactory.connect(admin).deploy();
        await conduitController.deployed();
        console.log("ConduitController:", conduitController.address);

        // Create a conduit with ConduitController
        const conduitKeyOne = `${admin.address}000000000000000000000000`;
        await conduitController.createConduit(conduitKeyOne, admin.address);
        const { conduit: conduitAddress, exists } = await conduitController.getConduit(conduitKeyOne);
        console.log("ConduitAddress:", conduitAddress, "exists: ", exists);

        // Deploy Seaport contract
        const SeaportFactory = await ethers.getContractFactory("Seaport");
        marketplace = await SeaportFactory.connect(admin).deploy(conduitController.address);
        await marketplace.deployed();
        console.log("Marketplace:", marketplace.address);

        // Deploy SharedStorefrontLazyMintAdapter contract
        const lazymintAdapterFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
        lazymintAdapter = await lazymintAdapterFactory
            .connect(admin)
            .deploy(marketplace.address, conduitAddress, assetToken.address);
        await lazymintAdapter.deployed();
        console.log("SharedStorefrontLazyMintAdapter:", lazymintAdapter.address);

        setSeaport(marketplace);

        // set the shared proxy of assetToken to SharedStorefront
        await assetToken.connect(adminSigner).addSharedProxyAddress(lazymintAdapter.address);

        // deploy WBOA contract
        const wboaFactory = await ethers.getContractFactory("WETH");
        wboaContract = (await wboaFactory.connect(admin).deploy()) as WETH;
        await wboaContract.deployed();
        console.log("WETH:", wboaContract.address);

        // deploy BoaFeeCollector contract
        const feeCollectorFactory = await ethers.getContractFactory("BoaFeeCollector");
        feeCollectorContract = (await feeCollectorFactory.connect(admin).deploy()) as BoaFeeCollector;
        await feeCollectorContract.deployed();
        console.log("BoaFeeCollector:", feeCollectorContract.address);

        // deploy UpgradeBeacon contract
        const beaconFactory = await ethers.getContractFactory("UpgradeBeacon");
        beaconContract = (await beaconFactory.connect(admin).deploy()) as UpgradeBeacon;
        await beaconContract.deployed();
        console.log("UpgradeBeacon:", beaconContract.address);

        // initialize the UpgradeBeacon contract
        await beaconContract.connect(admin).initialize(owner.address, feeCollectorContract.address);

        // deploy PayableProxy contract
        const proxyFactory = await ethers.getContractFactory("PayableProxy");
        proxyContract = (await proxyFactory.connect(admin).deploy(beaconContract.address)) as PayableProxy;
        await proxyContract.deployed();
        console.log("PayableProxy:", proxyContract.address);

        // initialize the PayableProxy
        await proxyContract.connect(admin).initialize(owner.address);

        // add wallet to withdraw the accumulated fees
        const encodedData = feeCollectorContract.interface.encodeFunctionData("addWithdrawAddress", [feeAdmin.address]);
        await ownerSigner.sendTransaction({
            to: proxyContract.address,
            data: encodedData,
        });

        // deposit from user to WBOA
        const deposotAmount = ethers.utils.parseEther("1000");
        await wboaContract.connect(offerer).deposit({ value: deposotAmount });
        await wboaContract.connect(fulfiller).deposit({ value: deposotAmount });

        await wboaContract.connect(offerer).approve(marketplace.address, deposotAmount);
        await wboaContract.connect(fulfiller).approve(marketplace.address, deposotAmount);
    });

    it("Mint a AssetContractShared token to fulfiller", async () => {
        const creatorContract = await assetToken.connect(fulfiller);
        tokenQuantity = Number(process.env.SPIDER_VERSE_NFT_QUANTITY || "1");
        const tokenIndex = BigNumber.from(process.env.SPIDER_VERSE_NFT_INDEX || "0");
        const data = process.env.SPIDER_VERSE_NFT_DATA || "";
        const buffer = ethers.utils.toUtf8Bytes(data);

        tokenId = createTokenId(fulfiller.address, tokenIndex, tokenQuantity);
        console.log("Combined tokenId: %s (%s)", tokenId.toString(), tokenId.toHexString());
        await creatorContract.mint(fulfiller.address, tokenId, tokenQuantity, buffer);
        console.log("Token minted to:", fulfiller.address);

        await creatorContract.setApprovalForAll(marketplace.address, true);
    });

    it("Offering WBOAs and NFTs as consideration with fees", async () => {
        const tokenPriceAmount = ethers.utils.parseEther("100");
        const feeAmount = ethers.utils.parseEther("2.5");
        const offerNFTs = await assetToken.balanceOf(offerer.address, tokenId);
        const fulfillerNFTs = await assetToken.balanceOf(fulfiller.address, tokenId);
        const offerWBoa = await wboaContract.balanceOf(offerer.address);
        const fulfillerWBoa = await wboaContract.balanceOf(fulfiller.address);
        const proxyWBoa = await wboaContract.balanceOf(proxyContract.address);
        const feeAdminBalance = await provider.getBalance(feeAdmin.address);

        // Minted Information
        console.log("token id:", tokenId);
        console.log("uri:", await assetToken.uri(tokenId));
        console.log("creator:", await assetToken.creator(tokenId));

        // create an offer that comes from buyer
        const offer: OfferItem[] = [
            {
                itemType: 1,
                token: wboaContract.address,
                identifierOrCriteria: toBN(0),
                startAmount: tokenPriceAmount,
                endAmount: tokenPriceAmount,
            },
        ];

        // create considerations
        const nftAmount: BigNumberish = BigNumber.from(1);
        const consideration: ConsiderationItem[] = [
            // the nft token that offerer will receive
            {
                itemType: 3,
                token: lazymintAdapter.address,
                identifierOrCriteria: toBN(tokenId),
                startAmount: toBN(nftAmount),
                endAmount: toBN(nftAmount),
                recipient: offerer.address,
            },
            // fee for the trading
            {
                itemType: 1,
                token: wboaContract.address,
                identifierOrCriteria: toBN(0),
                startAmount: toBN(feeAmount),
                endAmount: toBN(feeAmount),
                recipient: proxyContract.address,
            },
        ];

        const { order, orderHash, value } = await createOrder(
            offerer,
            ZeroAddress,
            offer,
            consideration,
            0 // FULL_OPEN
        );

        const tx = marketplace.connect(fulfillerSigner).fulfillOrder(order, toKey(0), {
            value,
        });
        const receipt = await (await tx).wait();
        console.log("receipt after fulfillOrder transaction:\n", receipt);

        await network.provider.send("evm_increaseTime", [3600]);
        await network.provider.send("evm_mine");

        expect(await assetToken.balanceOf(offerer.address, tokenId)).equal(offerNFTs.add(1));
        expect(await assetToken.balanceOf(fulfiller.address, tokenId)).equal(fulfillerNFTs.sub(1));

        // the offerer should have balance off 100 BOA from the original balance
        expect(await wboaContract.balanceOf(offerer.address)).equal(offerWBoa.sub(tokenPriceAmount));

        // the fulfiller should have 97.5% of the price more than
        // the original balance.
        expect(await wboaContract.balanceOf(fulfiller.address)).equal(
            fulfillerWBoa.add(tokenPriceAmount.div(1000).mul(975))
        );

        // the PayableProxy should have 2.5% of the price more than
        // the original balance.
        expect(await wboaContract.balanceOf(proxyContract.address)).equal(
            proxyWBoa.add(tokenPriceAmount.div(1000).mul(25))
        );

        // withdraw fees to feeAdmin
        const encodedData = feeCollectorContract.interface.encodeFunctionData("unwrapAndWithdraw", [
            feeAdmin.address,
            wboaContract.address,
            feeAmount,
        ]);
        const result = await ownerSigner.sendTransaction({
            to: proxyContract.address,
            data: encodedData,
        });

        // the fee admin has got BOAs as much as the fee
        expect(await provider.getBalance(feeAdmin.address)).equal(feeAdminBalance.add(feeAmount));
    });
});
