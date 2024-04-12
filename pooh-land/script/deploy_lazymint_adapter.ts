import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
    const LazymintAdapterFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
    const ConduitControllerFactory = await ethers.getContractFactory("ConduitController");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const marketplaceAddress = process.env.SEAPORT_ADDRESS;

    const useConduit = process.env.CONDUIT;
    let conduitAddress: string = ZeroAddress;
    if (useConduit) {
        const conduitContorller = await ConduitControllerFactory.attach(process.env.CONDUIT_CONTROLLER_ADDRESS || "");
        const ownerConduitContorller = await conduitContorller.connect(adminSigner);
        const conduitKey = process.env.CONDUIT_KEY || "";
        const { conduit: conduitAddr, exists } = await ownerConduitContorller.getConduit(conduitKey);
        console.log("seaportAddress: %s, conduitAddress: %s", marketplaceAddress, conduitAddr);
        conduitAddress = conduitAddr;
    }

    const tokenAddress = process.env.ASSET_CONTRACT_SHARED_ADDRESS || "";
    const lazymintAdapter = await LazymintAdapterFactory.connect(adminSigner).deploy(
        marketplaceAddress,
        conduitAddress,
        tokenAddress
    );
    await lazymintAdapter.deployed();
    console.log("SharedStorefrontLazyMintAdapter - deployed to:", lazymintAdapter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
