import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { ConduitControllerInterface } from "../typechain-types";
import { expect } from "chai";

async function main() {
    const ConduitControllerFactory = await ethers.getContractFactory("ConduitController");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const conduitContorller = await ConduitControllerFactory.attach(process.env.CONDUIT_CONTROLLER_ADDRESS || "");
    const ownerConduitContorller = await conduitContorller.connect(adminSigner);

    const conduitKeyOne = process.env.CONDUIT_KEY || "";
    const { conduit: conduitOneAddress, exists } = await ownerConduitContorller.getConduit(conduitKeyOne);

    expect(exists).to.be.true;

    console.log("Conduit address:", conduitOneAddress);
    console.log("conduitKey: ", conduitKeyOne);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
