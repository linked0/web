import { ethers } from "hardhat";

async function main() {
  const delegator = await ethers.deployContract(
    "AllBasic"
  );
  await delegator.waitForDeployment();

  console.log(`Deployed TRANSACTION_DELEGATOR_CONTRACT: ${delegator.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
