import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");

    const provider = ethers.provider;
    const buyer = process.env.TRANSFER_BUYER || "";
    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");

    const tokenIds = process.env.TRANSFER_COMBINE_TOKEN_IDS.split(",");
    console.log("Creator:", creator.address);
    console.log("Buyer:", buyer);
    console.log("TokenIds:", tokenIds);
    for (let id of tokenIds) {
        const tokenId = BigNumber.from(id.trim());
        console.log("# Balances of Token: %s (%s)", tokenId.toString(), tokenId.toHexString());
        console.log(
            "\tcreator(%s): %i, buyer(%s): %i",
            creator.address,
            Number(await assetContract.balanceOf(creator.address, tokenId)),
            buyer,
            Number(await assetContract.balanceOf(buyer, tokenId))
        );
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
