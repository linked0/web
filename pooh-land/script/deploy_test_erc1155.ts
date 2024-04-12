import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { randomBN, toBN } from "../test/utils/encoding";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const TestERC1155Factory = await ethers.getContractFactory("BoaTestERC1155");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const creator = new Wallet(process.env.USER_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));
    const marketplaceContract = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");

    // deploy TestERC1155 contract
    const token = await TestERC1155Factory.connect(creatorSigner).deploy();
    await token.deployed();
    console.log("TestERC1155 deployed - to:", token.address);

    // mint first NFT token of TestERC1155
    const nftId = 0;
    const amount = 10;
    await token.mint(creator.address, nftId, amount);
    console.log("Token minted - token id:", nftId, ", amount:", amount);

    // approve to the marketplace
    await token.setApprovalForAll(marketplaceContract.address, true);
    console.log("SetApprovalForAll called");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
