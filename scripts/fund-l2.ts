// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import chai, { assert, expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  // Fund eth from admin to 4 accounts
  const provider = ethers.provider;
  const adminWallet = new ethers.Wallet(process.env.ADMIN_KEY || "", provider);
  const accounts = [
    process.env.GS_ADMIN_ADDRESS,
    process.env.GS_BATCHER_ADDRESS,
    process.env.GS_PROPOSER_ADDRESS,
    process.env.GS_SEQUENCER_ADDRESS,
  ];
  const amount = ethers.parseEther("10");
  for (const account of accounts) {
    const tx = await adminWallet.sendTransaction({
      to: account,
      value: amount,
    });
    await tx.wait();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
