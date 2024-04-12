import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const controllerFactory = await ethers.getContractFactory("ConduitController");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const controller = await controllerFactory.attach(process.env.CONDUIT_CONTROLLER_ADDRESS || "");
    const [creationCodeHash, runtimeCodeHash] = await controller.connect(adminSigner).getConduitCodeHashes();
    console.log("creationCodeHash: ", creationCodeHash);
    console.log("runtimeCodeHash: ", runtimeCodeHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
