import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { WBOA9 } from "../typechain-types";
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";

async function main() {
    const WBOA9Factory = await ethers.getContractFactory("WBOA9");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const WBOA9 = await WBOA9Factory.connect(adminSigner).deploy();
    await WBOA9.deployed();

    console.log("WBOA9 deployed:", WBOA9.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
