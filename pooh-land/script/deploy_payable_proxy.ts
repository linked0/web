import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const feeOwner = process.env.FEE_COLLECTOR_OWNER || "";

    // deploy BoaFeeCollector contract
    const collectorFactory = await ethers.getContractFactory("BoaFeeCollector");
    const collectorContract = await collectorFactory.connect(adminSigner).deploy();
    await collectorContract.deployed();
    console.log("BoaFeeCollector:", collectorContract.address);

    // deploy UpgradeBeacon contract
    const beaconFactory = await ethers.getContractFactory("UpgradeBeacon");
    const beaconContract = await beaconFactory.connect(adminSigner).deploy();
    await beaconContract.deployed();
    console.log("UpgradeBeacon:", beaconContract.address);

    // initialize the UpgradeBeacon contract
    await beaconContract.connect(adminSigner).initialize(feeOwner, collectorContract.address);

    // deploy PayableProxy contract
    const proxyFactory = await ethers.getContractFactory("PayableProxy");
    const proxyContract = await proxyFactory.connect(adminSigner).deploy(beaconContract.address);
    await proxyContract.deployed();
    console.log("PayableProxy:", proxyContract.address);

    // initialize the PayableProxy
    await proxyContract.connect(adminSigner).initialize(feeOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
