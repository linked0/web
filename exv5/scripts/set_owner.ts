import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
  const issuedFactory = await ethers.getContractFactory("IssuedContract");
  const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
  const provider = ethers.provider;

  const curOwner = new Wallet(process.env.CURRENT_OWNER || "");
  const curOwnerSigner = new NonceManager(
    new GasPriceManager(provider.getSigner(curOwner.address))
  );

  const issued = await issuedFactory.attach(process.env.ISSUED_CONTRACT || "");
  const newOwner = process.env.NEW_OWNER || "";
  await issued.connect(curOwnerSigner).setOwner(newOwner);
  console.log("New owner set to IssuedContract:", newOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
