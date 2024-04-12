import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const conduitControllerAddress = process.env.CONDUIT_CONTROLLER_ADDRESS || "";
    const seaport = await SeaportFactory.connect(adminSigner).deploy(conduitControllerAddress);
    await seaport.deployed();

    console.log("Seaport - deployed to:", seaport.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
