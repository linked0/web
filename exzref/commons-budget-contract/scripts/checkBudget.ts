// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import chai, { assert, expect } from "chai";
import { GasPriceManager } from "../utils/GasPriceManager";

import {BigNumber, Wallet} from "ethers";
import { ethers } from "hardhat";

import { NonceManager } from "@ethersproject/experimental";

async function main() {
    const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
    const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");

    const provider = ethers.provider;
    const commonsBudget = await commonsBudgetFactory.attach(process.env.COMMONS_BUDGET_CONTRACT || "");
    const adminWallet = new Wallet(process.env.ADMIN_KEY || "", provider);
    const managerWallet = new Wallet(process.env.MANAGER_KEY || "", provider);
    const voteraWallet = new Wallet(process.env.VOTE_KEY || "", provider);

    const cent = BigNumber.from(10).pow(18);
    const commonsBalance = BigNumber.from(await ethers.provider.getBalance(commonsBudget.address));
    console.log("========== Format: {BOA} . {CENT} ==========");
    console.log("CommonsBudget balance: ", commonsBalance.div(cent).toString(), ".", commonsBalance.mod(cent).toString());
    const adminBalance = BigNumber.from(await ethers.provider.getBalance(adminWallet.address));
    console.log("Admin         balance: ", adminBalance.div(cent).toString(), ".", adminBalance.mod(cent).toString());
    const managerBalance = BigNumber.from(await ethers.provider.getBalance(managerWallet.address));
    console.log("Manager       balance: ", managerBalance.div(cent).toString(), ".", managerBalance.mod(cent).toString());
    const voteraBalance = BigNumber.from(await ethers.provider.getBalance(voteraWallet.address));
    console.log("Votera        balance: ", voteraBalance.div(cent).toString(), ".", voteraBalance.mod(cent).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
