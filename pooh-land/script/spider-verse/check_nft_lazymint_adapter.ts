import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";

async function main() {
    const LazyMintAdapterFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");

    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");
    const lazymintAdapter = await LazyMintAdapterFactory.attach(process.env.LAZY_MINT_ADAPTER_ADDRESS || "");
    const tokenId = BigNumber.from(process.env.SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID || "");

    console.log("====== Minted NFT information ======");
    console.log("tokenId:", tokenId);
    console.log("tokenId(HEX):", tokenId.toHexString());
    console.log("creator:", creator.address);
    console.log("balance of creator:", await lazymintAdapter.balanceOf(creator.address, tokenId));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
