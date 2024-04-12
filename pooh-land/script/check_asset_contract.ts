import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { ConduitControllerInterface } from "../typechain-types";
import { expect } from "chai";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");

    console.log("====== AssetContractShared information ======");
    console.log("address:", process.env.ASSET_CONTRACT_SHARED_ADDRESS);
    console.log("name:", await assetContract.name());
    console.log("symbol:", await assetContract.symbol());
    console.log("templateURI:", await assetContract.templateURI());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
