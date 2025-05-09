import { ethers } from "hardhat";

async function main() {
  const constract = await ethers.deployContract("AllCounter");
  await constract.waitForDeployment();

  console.log(`Deployed AllCounter: ${constract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
