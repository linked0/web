import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
  const issuedFactory = await ethers.getContractFactory("IssuedContract");
  const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
  const provider = ethers.provider;

  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const adminSigner = new NonceManager(
    new GasPriceManager(provider.getSigner(admin.address))
  );

  const issued = await issuedFactory.attach(process.env.ISSUED_CONTRACT || "");
  const commonsBudget = await commonsBudgetFactory.attach(
    process.env.COMMONS_BUDGET_CONTRACT || ""
  );

  await issued
    .connect(adminSigner)
    .setCommonsBudgetAddress(commonsBudget.address);
  console.log(
    "CommonsBudget address:",
    commonsBudget.address,
    "set into IssuedContract:",
    issued.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
