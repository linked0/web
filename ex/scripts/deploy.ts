import { ethers } from "hardhat";

async function main() {
  const mytoken = await ethers.deployContract("MyToken");
  await mytoken.waitForDeployment();
  console.log(`Deployed MINTABLE_TOKEN: ${mytoken.target}`);

  const delegator = await ethers.deployContract("TransactionDelegator", [
    mytoken.target,
  ]);
  await delegator.waitForDeployment();

  console.log(`Deployed TRANSACTION_DELEGATOR_CONTRACT: ${delegator.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
