import { ethers } from "hardhat";

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const contractAddress = process.env.DATA_STORAGE_CONTRACT;
  if (!contractAddress) {
    throw new Error("DATA_STORAGE_CONTRACT environment variable not set.");
  }
  const contract = await ethers.getContractAt("AllBasic", contractAddress);
  console.log("DATA_STORAGE_CONTRACT: ", contractAddress);
  const contractAdmin = contract.connect(deployer)
  
  await contractAdmin.add();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
