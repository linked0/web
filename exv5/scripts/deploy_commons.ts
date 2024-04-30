import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
  const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
  const provider = ethers.provider;

  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const adminSigner = new NonceManager(
    new GasPriceManager(provider.getSigner(admin.address))
  );

  const commonsBudget = await commonsBudgetFactory
    .connect(adminSigner)
    .deploy();
  await commonsBudget.deployed();

  console.log("CommonsBudget - deployed to:", commonsBudget.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
