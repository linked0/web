import { NonceManager } from "@ethersproject/experimental";
import { expect } from "chai";
import { BigNumber, BigNumberish, Wallet } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { getItemETH, toBN, toKey } from "../../test/utils/encoding";
import { BoaTestERC1155, Seaport, TestZone } from "../../typechain-types";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { checkExpectedEvents, createOrder, setContracts, withBalanceChecks } from "../../utils/CommonFunctions";
import type { OfferItem } from "../../test/utils/types";
const { parseEther, keccak256 } = ethers.utils;

const ZeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const nftBuyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const nftBuyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftBuyer.address)));
    const owner = new Wallet(process.env.OWNER_KEY || "");
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const zone = new Wallet(process.env.ZONE_KEY || "");
    const nftSeller = new Wallet(process.env.ORDER_NFT_SELLER_KEY || "");
    const nftSellerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftSeller.address)));
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const marketplaceContract = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");
    const sharedAsset = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const tokenId = BigNumber.from(process.env.SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID || "");
    setContracts(marketplaceContract, sharedAsset);

    await sharedAsset.connect(nftSellerSigner).setApprovalForAll(marketplaceContract.address, true);
    console.log("SetApprovalForAll called");

    // NFT seller creates an order that has an NFT token that he owns
    const nftAmount: BigNumberish = BigNumber.from(1);
    const offer: OfferItem[] = [
        {
            itemType: 3,
            token: sharedAsset.address,
            identifierOrCriteria: toBN(tokenId),
            startAmount: toBN(nftAmount),
            endAmount: toBN(nftAmount),
        },
    ];

    // The consideration is the payment for the NFT token
    const consideration = [getItemETH(parseEther("0.1"), parseEther("0.1"), nftBuyer.address)];

    const { order, orderHash, value } = await createOrder(
        nftSeller,
        ZeroAddress,
        offer,
        consideration,
        0 // FULL_OPEN
    );

    console.log("orderHash:", orderHash);
    console.log("value:", value);
    console.log("order:", order);
    console.log("offer:", order.parameters.offer);
    console.log("consideration:", order.parameters.consideration);

    const tx = marketplaceContract.connect(nftBuyerSigner).fulfillOrder(order, toKey(0), {
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
