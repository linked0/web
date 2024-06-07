import { ethers } from "hardhat";

async function main() {
  const contractName = process.env.CONTRACT_NAME || "";
  const constract = await ethers.deployContract(
    contractName
  );
  await constract.waitForDeployment();

  console.log(`Deployed ${contractName}: ${constract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
