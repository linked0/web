import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { AssetContractShared } from "../../typechain-types";
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";
import { createTokenId, parseTokenId } from "../../utils/ParseTokenID";
import { token } from "../../typechain-types/@openzeppelin/contracts";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const creator = new Wallet(process.env.SPIDER_VERSE_NFT_CREATOR_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const creatorContract = await assetContract.connect(creatorSigner);

    const quantity = Number(process.env.SPIDER_VERSE_NFT_QUANTITY || "1");
    const tokenIndex = BigNumber.from(process.env.SPIDER_VERSE_NFT_INDEX || "0");
    const data = process.env.SPIDER_VERSE_NFT_DATA || "";
    const buffer = ethers.utils.toUtf8Bytes(data);

    const tokenId = createTokenId(creator.address, tokenIndex, quantity);
    console.log("Combined tokenId:", tokenId.toString(), "(", tokenId.toHexString(), ")");

    await creatorContract.mint(creator.address, tokenId, quantity, buffer);
    console.log("Token minted to:", creator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
