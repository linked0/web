import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// TODO: 아래 예제도 만들어보자.
/* 
const pair = getCreate2Address(
 FACTORY_ADDRESS,
 keccak256(['bytes'], [pack(['address', 'address'], [token0, token1])]),
 INIT_CODE_HASH
)
*/ 

// How to deploy smart contract with raw transaction
// https://ethereum.stackexchange.com/questions/144905/how-to-deploy-smart-contract-with-raw-transaction

describe("Send Factory Transaction", function () {
    const contractAddress = "0x4e59b44847b379578588920ca78fbf26c0b4956c"

    it("Should send transaction", async function () {
        const factory = await ethers.getContractFactory("Ondo");
        const ondo = await factory.deploy();
        console.log("Ondo deployed to:", ondo.address);
    });
});