import { ethers } from "hardhat";

async function main() {
  const contractAddress = process.env.JAY_SMART_ACCOUNT_CONTRACT || "";
  // get the contract instance
  const contract = await ethers.getContractAt("JaySmartAccount", contractAddress);
  // call the getSigValidationFailed function
  const result = await contract.getSigValidationFailed();
  console.log(`getSigValidationFailed: ${result}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
