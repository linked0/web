import { ethers } from "hardhat";
import { Contract } from "ethers";
import { MyToken } from "../typechain-types";

async function main() {
  const TokenFactory = await ethers.getContractFactory("MyToken");
  const myToken = TokenFactory.attach(process.env.MINTABLE_TOKEN || "") as Contract & MyToken;
  const balance = await myToken.balanceOf(process.env.TOKEN_RECEIVER || "");
  console.log(`Balance of ${process.env.TOKEN_RECEIVER}: ${balance.toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
