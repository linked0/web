import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { AssetContractShared } from "../../typechain-types";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");
    const buyer = process.env.TRANSFER_BUYER || "";
    const proxy = new Wallet(process.env.SHARED_PROXY_KEY || "");
    const proxySigner = new NonceManager(new GasPriceManager(provider.getSigner(proxy.address)));
    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const proxyContract = await assetContract.connect(proxySigner);

    const tokenIds = process.env.TRANSFER_COMBINE_TOKEN_IDS.split(",");
    let transferIds: BigNumber[] = [];
    for (let id of tokenIds) {
        const tokenId = BigNumber.from(id.trim());
        transferIds.push(tokenId);
    }

    const tokenAmounts = process.env.TRANSFER_AMOUNTS.split(",");
    let transferAmounts: Number[] = [];
    for (let amount of tokenAmounts) {
        const tokenAmount = Number(amount.trim());
        if (tokenAmount == 0) {
            console.log("ERROR: Amount is invalid:", tokenAmount);
            return;
        }
        transferAmounts.push(tokenAmount);
    }

    if (transferIds.length != transferAmounts.length) {
        console.log("ERROR: The counts of Id and Amount are not matched");
        return;
    }

    const buffer = ethers.utils.toUtf8Bytes("");
    await proxyContract.safeBatchTransferFrom(creator.address, buyer, transferIds, transferAmounts, buffer);

    console.log(transferIds);
    console.log("Tokens Transferred to", buyer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
