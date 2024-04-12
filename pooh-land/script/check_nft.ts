import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { parseTokenId } from "../utils/ParseTokenID";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const ownerAssetContract = await assetContract.connect(adminSigner);

    const tokenId = BigNumber.from(process.env.SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID || "");
    const [address, tokenIndex, maxSupply] = parseTokenId(tokenId.toString());

    console.log("====== Minted NFT information ======");
    console.log("tokenId:", tokenId);
    console.log("tokenId(HEX):", tokenId.toHexString());
    console.log("uri:", await ownerAssetContract.uri(tokenId));
    console.log("creator:", await ownerAssetContract.creator(tokenId));
    console.log("token index:", tokenIndex.toString());
    console.log("max supply:", maxSupply);
    console.log("balance of creator:", (await ownerAssetContract.balanceOf(creator.address, tokenId)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
