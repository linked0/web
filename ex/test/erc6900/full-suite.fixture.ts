import { ethers } from "hardhat";

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const EntryPointFactory = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPointFactory.deploy();
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
