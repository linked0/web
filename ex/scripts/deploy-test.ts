import { ethers } from "hardhat";

async function main() {
  const test = await ethers.deployContract("Test", [6]);
  await test.waitForDeployment();

  console.log(`Deployed to ${test.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
