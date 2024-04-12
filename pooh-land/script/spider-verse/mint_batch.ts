import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, BigNumberish, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { AssetContractShared } from "../../typechain-types";
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { createTokenId, parseTokenId } from "../../utils/ParseTokenID";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const creatorContract = await assetContract.connect(creatorSigner);

    const batchCount = Number(process.env.SPIDER_VERSE_NFT_BATCH_COUNT || "1");
    const tokenIndex = BigNumber.from(process.env.SPIDER_VERSE_NFT_INDEX || "0");
    const data = process.env.SPIDER_VERSE_NFT_DATA || "";
    const buffer = ethers.utils.toUtf8Bytes(data);

    let tokenIds: BigNumber[] = [];
    let quantities: BigNumberish[] = [];
    let makerPart = BigNumber.from(ethers.utils.hexZeroPad(creator.address, 32));
    makerPart = makerPart.shl(96); // shift 12 bytees
    let tokenIdsStr: string = "";
    for (let i = 0; i < batchCount; i++) {
        const quantity = Number(process.env.SPIDER_VERSE_NFT_QUANTITY || "1");
        quantities.push(quantity);
        const tokenId = createTokenId(creator.address, tokenIndex.add(i), quantity);
        tokenIdsStr += tokenId.toHexString() + " , ";
        tokenIds.push(tokenId);
    }
    console.log("====== Combine tokenIds(HEX) ======");
    console.log(tokenIdsStr.slice(0, -3));
    console.log("====== Combine tokenIds ======");
    for (let id of tokenIds) {
        console.log(id.toString());
    }

    await creatorContract.batchMint(creator.address, tokenIds, quantities, buffer);
    console.log("All tokens minted to:", creator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
