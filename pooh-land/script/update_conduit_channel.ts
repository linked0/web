import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { ConduitController, Seaport } from "../typechain-types";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const provider = ethers.provider;

    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const ConduitControlFactory = await ethers.getContractFactory("ConduitController");

    const marketplace = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");
    const conduitController = await ConduitControlFactory.attach(process.env.CONDUIT_CONTROLLER_ADDRESS);

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const conduitKey = process.env.CONDUIT_KEY || "";

    const { conduit: conduitAddress, exists } = await conduitController.getConduit(conduitKey);
    console.log("conduit address: %s for the conduit key: %s", conduitAddress, conduitKey);

    // update channel for marketplace to conduit
    let status = await conduitController.connect(adminSigner).getChannelStatus(conduitAddress, marketplace.address);
    if (!status) {
        console.log("updateChannel:", conduitAddress, marketplace.address);
        await conduitController.connect(adminSigner).updateChannel(conduitAddress, marketplace.address, true);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
