import { ethers } from "hardhat";

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const entryPoint = await ethers.deployContract("EntryPoint");
  const singleOwnerPlugin = await ethers.deployContract("SingleOwnerPlugin", []);

  return {
    accounts: {
      deployer,
      user,
    },
    suite: {
      entryPoint,
      singleOwnerPlugin,
    },
  };
}