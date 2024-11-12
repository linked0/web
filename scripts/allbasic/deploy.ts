import { ethers } from "hardhat";

async function main() {
  const allBasic = await ethers.deployContract("AllBasic");
  console.log(`Deployed allBasic: ${allBasic.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
