import { ethers } from "hardhat";
import { BigNumber, Wallet } from "ethers";

async function main() {
  const Factory = await ethers.getContractFactory("DeterministicDeployFactory");
  const factory = await Factory.deploy();

  await factory.deployed();
  console.log("Factory deployed to:", factory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});