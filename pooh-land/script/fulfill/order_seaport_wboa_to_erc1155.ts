import { NonceManager } from "@ethersproject/experimental";
import { expect } from "chai";
import { BigNumber, BigNumberish, Wallet } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { getBasicOrderExecutions, getBasicOrderParameters, getItemETH, toBN, toKey } from "../../test/utils/encoding";
import { ConduitController, Consideration, Seaport, SharedStorefrontLazyMintAdapter } from "../../typechain-types";
import { GasPriceManager } from "../../utils/GasPriceManager";
import {
    checkExpectedEvents,
    createOrder,
    depositToWBoa,
    displayBoaBalance,
    displayNFTBalance,
    displayWBoaBalance,
    setAssetContract,
    setContracts,
    setSeaport,
    setWBoaContract,
    withBalanceChecks,
} from "../../utils/CommonFunctions";
import type { ConsiderationItem, OfferItem } from "../../test/utils/types";
const { parseEther, keccak256 } = ethers.utils;

const ZeroAddress = "0x0000000000000000000000000000000000000000";
const MAX_INT = BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const StorefrontFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
    const ConduitControlFactory = await ethers.getContractFactory("ConduitController");
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const WBOAFactory = await ethers.getContractFactory("WETH");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const nftBuyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const nftBuyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftBuyer.address)));
    const nftSeller = new Wallet(process.env.ORDER_NFT_SELLER_KEY || "");
    const nftSellerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftSeller.address)));
    const conduitKey = process.env.CONDUIT_KEY || "";
    const marketplace = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");
    const storefront = await StorefrontFactory.attach(process.env.LAZY_MINT_ADAPTER_ADDRESS || "");
    const conduitController = await ConduitControlFactory.attach(process.env.CONDUIT_CONTROLLER_ADDRESS);
    const assetToken = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS);
    const wboaToken = await WBOAFactory.attach(process.env.WBOA_ADDRESS);
    const tokenId = BigNumber.from(process.env.SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID || "");

    const { conduit: conduitAddress, exists } = await conduitController.getConduit(conduitKey);
    console.log("conduit address: %s for the conduit key: %s", conduitAddress, conduitKey);

    setContracts(marketplace, assetToken, wboaToken);

    // approve WBOAs of seller to the Seaport
    const tokenPriceAmount = ethers.utils.parseEther("0.1");
    await wboaToken.connect(nftBuyerSigner).approve(marketplace.address, MAX_INT);

    // Current status of seller, buyer, and nft
    await displayNFTBalance("Seller", tokenId, nftSeller.address);
    await displayBoaBalance("Buyer", nftBuyer.address);
    await displayBoaBalance("Seller", nftSeller.address);

    // deposit BOA to WBOA contract from NFT buyer
    const totalDeposit = ethers.utils.parseEther("1.0");
    await depositToWBoa(nftBuyer.address, totalDeposit);
    await displayWBoaBalance("Buyer", nftBuyer.address);
    await displayWBoaBalance("Seller", nftSeller.address);

    // TODO: Make utility functions creating offer and consideration

    // Creating an offer which is the ERC20 tokens
    const offer: OfferItem[] = [
        {
            itemType: 1,
            token: wboaToken.address,
            identifierOrCriteria: toBN(0),
            startAmount: toBN(tokenPriceAmount),
            endAmount: toBN(tokenPriceAmount),
        },
    ];

    // Creating the first consideration which is goes to the NFT buyer
    // TODO: Add consideration going to the Proxy
    const nftAmount: BigNumberish = BigNumber.from(1);
    const consideration: ConsiderationItem[] = [
        {
            itemType: 3,
            token: storefront.address,
            identifierOrCriteria: toBN(tokenId),
            startAmount: toBN(nftAmount),
            endAmount: toBN(nftAmount),
            recipient: nftBuyer.address,
        },
    ];

    const { order, orderHash, value } = await createOrder(
        nftBuyer,
        ZeroAddress,
        offer,
        consideration,
        1 // PARTIAL_OPEN
    );

    console.log("orderHash:", orderHash);
    console.log("value:", value);
    console.log("order:", order);
    console.log("offer:", order.parameters.offer);
    console.log("consideration:", order.parameters.consideration);

    const tx = marketplace.connect(nftSellerSigner).fulfillOrder(order, toKey(0), {
        value,
    });
    const receipt = await (await tx).wait();
    console.log("receipt after fulfullOrder transaction:\n", receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
