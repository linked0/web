import { NonceManager } from "@ethersproject/experimental";
import { expect } from "chai";
import { BigNumber, BigNumberish, constants, Contract, ContractReceipt, ContractTransaction, Wallet } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
import {
    BoaTestERC1155,
    ConduitInterface,
    ConsiderationInterface,
    EIP1271Wallet__factory,
    Seaport,
    TestERC1155,
    TestERC20,
    TestERC721,
    TestZone,
} from "../typechain-types";
import { GasPriceManager } from "../utils/GasPriceManager";
const { orderType } = require("../eip-712-types/order");

const { parseEther, keccak256 } = ethers.utils;
let marketplaceContract: Seaport;
let testERC1155: BoaTestERC1155;
const provider = ethers.provider;

async function main() {
    const SeaportFactory = await ethers.getContractFactory("Seaport");
    const TestERC1155Factory = await ethers.getContractFactory("BoaTestERC1155");

    const creator = new Wallet(process.env.USER_KEY || "");
    const owner = new Wallet(process.env.OWNER_KEY || "");
    const zone = new Wallet(process.env.ZONE_KEY || "");
    const buyer = new Wallet(process.env.BUYER_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));
    const buyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(buyer.address)));
    marketplaceContract = await SeaportFactory.attach(process.env.SEAPORT_ADDRESS || "");
    testERC1155 = await TestERC1155Factory.attach(process.env.BOA_TEST_ERC1155_ADDRESS || "");

    const amount = await provider.getBalance(creator.address);
    console.log("Creator balance:", amount);
    let nftAmount = await testERC1155.getAmount(creator.address, 0);
    console.log("balance of", creator.address, ":", nftAmount);
    nftAmount = await testERC1155.getAmount(buyer.address, 0);
    console.log("balance of", buyer.address, ":", nftAmount);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
