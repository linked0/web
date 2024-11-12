import { ethers } from "hardhat";
import { BigNumber, Wallet } from "ethers";

async function main() {
  const provider = ethers.provider;

  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const owner = new Wallet(process.env.OWNER_KEY || "");
  const adminSigner = provider.getSigner(admin.address);
  const amount = await provider.getBalance(admin.address);
  const amountOwner = await provider.getBalance(owner.address);
  const nonce = await provider.getTransactionCount(admin.address);
  console.log("nonce:", nonce);

  console.log("Admin balalnce:", amount.toString());
  console.log("Owner balalnce:", amountOwner.toString());
}

  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
