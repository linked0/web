import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { AssetContractShared } from "../../typechain-types";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));
    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const creatorContract = await assetContract.connect(creatorSigner);

    const tokenIds = process.env.MANY_BUYER_COMBINE_TOKEN_IDS.split(",");
    let transferIds: BigNumber[] = [];
    for (let id of tokenIds) {
        const tokenId = BigNumber.from(id.trim());
        transferIds.push(tokenId);
    }

    const buyers = process.env.MANY_BUYER_BUYERS.split(",");
    let transferBuyers: string[] = [];
    for (let buyer of buyers) {
        transferBuyers.push(buyer.trim());
    }

    const tokenAmounts = process.env.MANY_BUYER_AMOUNTS.split(",");
    let transferAmounts: Number[] = [];
    for (let amount of tokenAmounts) {
        const tokenAmount = Number(amount.trim());
        if (tokenAmount == 0) {
            console.log("ERROR: Amount is invalid:", tokenAmount);
            return;
        }
        transferAmounts.push(tokenAmount);
    }

    if (transferBuyers.length != transferAmounts.length) {
        console.log("ERROR: The counts of Id and Amount are not matched");
        return;
    }

    const data = process.env.SPIDER_VERSE_NFT_DATA || "";
    const buffer = ethers.utils.toUtf8Bytes(data);

    for (let i = 0; i < transferIds.length; i++) {
        console.log(transferIds[i].toHexString());
        await creatorContract.safeTransferFrom(
            creator.address,
            transferBuyers[i],
            transferIds[i],
            transferAmounts[i],
            buffer
        );
        console.log("%i Tokens Transferred to", transferAmounts[i], transferBuyers[i]);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
