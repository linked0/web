import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("Create2Factory");
  // print transaction of factory deployment
  console.log("Create2Factory deployed to:", contract.target);
  // print transaction hash
  console.log("Transaction hash:", contract.deploymentTransaction());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
