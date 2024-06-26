// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import chai, { assert, expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const poohentFundFactory = await ethers.getContractFactory("PoohnetFund");

  const provider = ethers.provider;
  const poohentFund = await poohentFundFactory.attach(
    process.env.POOHNET_FUND_CONTRACT_ADDRESS || ""
  );
  const adminWallet = new Wallet(process.env.ADMIN_KEY || "", provider);

  const fundBalance = await ethers.provider.getBalance(poohentFund.target);
  console.log("PoohentFund balance: ", fundBalance);
  const adminBalance = await ethers.provider.getBalance(adminWallet.address);
  console.log("Admin balance: ", adminBalance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
