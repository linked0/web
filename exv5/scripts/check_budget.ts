// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
  const provider = ethers.provider;

  const issuedFactory = await ethers.getContractFactory("IssuedContract");
  const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");

  const issued = await issuedFactory.attach(process.env.ISSUED_CONTRACT || "");
  const commonsBudget = await commonsBudgetFactory.attach(
    process.env.COMMONS_BUDGET_CONTRACT || ""
  );
  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const user = new Wallet(process.env.USER_KEY || "");

  const adminSigner = new NonceManager(
    new GasPriceManager(provider.getSigner(admin.address))
  );
  const chainId = await await issued.connect(adminSigner).getChainId();
  console.log("ChainId:", chainId);

  const cent = BigNumber.from(10).pow(18);
  const issuedBalance = BigNumber.from(
    await ethers.provider.getBalance(issued.address)
  );
  const commonsBalance = BigNumber.from(
    await ethers.provider.getBalance(commonsBudget.address)
  );
  const adminBalance = BigNumber.from(
    await ethers.provider.getBalance(admin.address)
  );
  const userBalance = BigNumber.from(
    await ethers.provider.getBalance(user.address)
  );
  console.log("========== Balance: {BOA} . {CENT} ==========");

  // IssuedContract balance
  console.log(
    "IssuedContract Balance (",
    issued.address,
    ") :",
    issuedBalance.div(cent).toString(),
    ".",
    issuedBalance.mod(cent).toString()
  );

  // CommonsBudget balance
  console.log(
    "CommonsBudget Balance(",
    commonsBudget.address,
    ") :",
    commonsBalance.div(cent).toString(),
    ".",
    commonsBalance.mod(cent).toString()
  );

  // Admin balance
  console.log(
    "Admin Balance(",
    admin.address,
    ") :",
    adminBalance.div(cent).toString(),
    ".",
    adminBalance.mod(cent).toString()
  );

  // User balance
  console.log(
    "User Balance(",
    user.address,
    ") :",
    userBalance.div(cent).toString(),
    ".",
    userBalance.mod(cent).toString()
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
