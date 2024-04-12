import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";

async function main() {
  console.log("====== Deploy Keyless ======");
  const Factory = await ethers.getContractFactory("DeterministicDeployFactory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("DeterministicDeployFactory - deployed to:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process
});
