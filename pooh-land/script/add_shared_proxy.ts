import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { AssetContractShared } from "../typechain-types";

async function main() {
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const StorefrontFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const storefront = await StorefrontFactory.attach(process.env.LAZY_MINT_ADAPTER_ADDRESS || "");

    const assetContract = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const ownerContract = await assetContract.connect(adminSigner);

    // set the shared proxy of assetToken to SharedStorefront
    await ownerContract.addSharedProxyAddress(storefront.address);
    console.log("Add to SharedProxyAddress - address:", storefront.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
