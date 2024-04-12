import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const ConduitControllerFactory = await ethers.getContractFactory("ConduitController");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const conduitController = await ConduitControllerFactory.connect(adminSigner).deploy();
    await conduitController.deployed();

    console.log("ConduitController - deployed to:", conduitController.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
