import { Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractAt("AllBasic", process.env.DATA_STORAGE_CONTRACT || "");

  console.log("DATA_STORAGE_CONTRACT: ", await contract.getAddress());

  const value = await contract.getValue();
  console.log(value);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
