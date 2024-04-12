import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const name = process.env.ASSET_CONTRACT_NAME || "";
    const symbol = process.env.ASSET_CONTRACT_SYMBOL || "";
    const templateURI = process.env.ASSET_CONTRACT_TEMPLATE_URI || "";
    console.log(name, ",", symbol, ",", templateURI);
    const assetContract = await AssetContractFactory.connect(adminSigner).deploy(
        name,
        symbol,
        ethers.constants.AddressZero,
        templateURI,
        ethers.constants.AddressZero
    );
    await assetContract.deployed();

    console.log("AssetContractShared - deployed to:", assetContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
