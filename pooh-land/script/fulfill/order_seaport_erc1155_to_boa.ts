import { NonceManager } from "@ethersproject/experimental";
import { expect } from "chai";
import { BigNumber, BigNumberish, Wallet } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { getBasicOrderExecutions, getBasicOrderParameters, getItemETH, toBN, toKey } from "../../test/utils/encoding";
import { ConduitController, Consideration, Seaport, SharedStorefrontLazyMintAdapter } from "../../typechain-types";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { checkExpectedEvents, createOrder, setContracts, withBalanceChecks } from "../../utils/CommonFunctions";
import type { ConsiderationItem, OfferItem } from "../../test/utils/types";
const { parseEther, keccak256 } = ethers.utils;

const ZeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const StorefrontFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const nftSeller = new Wallet(process.env.ORDER_NFT_SELLER_KEY || "");
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const nftBuyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const nftBuyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftBuyer.address)));
    const marketplace = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");
    const storefront = await StorefrontFactory.attach(process.env.LAZY_MINT_ADAPTER_ADDRESS || "");
    const assetToken = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS);
    const tokenId = BigNumber.from(process.env.SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID || "");

    setContracts(marketplace, assetToken);

    // TODO: Make utility functions creating offer and consideration

    // NFT seller creates an order that has an NFT token that he owns
    const nftAmount: BigNumberish = BigNumber.from(1);
    const offer: OfferItem[] = [
        {
            itemType: 3,
            token: storefront.address,
            identifierOrCriteria: toBN(tokenId),
            startAmount: toBN(nftAmount),
            endAmount: toBN(nftAmount),
        },
    ];

    // Creating the first consideration which is goes to the NFT seller
    const consideration = [getItemETH(parseEther("0.1"), parseEther("0.1"), nftSeller.address)];

    const { order, orderHash, value } = await createOrder(
        nftSeller,
        ZeroAddress,
        offer,
        consideration,
        0 // FULL_OPEN
    );

    console.log("order:", order);
    console.log("offer:", order.parameters.offer);
    console.log("consideration:", order.parameters.consideration);
    console.log("orderHash:", orderHash);
    console.log("value:", value);

    const tx = marketplace.connect(nftBuyerSigner).fulfillOrder(order, toKey(0), {
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
