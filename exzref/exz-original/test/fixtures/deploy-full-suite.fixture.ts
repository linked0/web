import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deployFullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("Greeter");
  const greeter = await Factory.deploy("Hello, Hardhat!");

  const basic = await ethers.deployContract("Basic");

  return {
    accounts: {
      deployer,
      user,
    },
    suite: {
      greeter,
      basic,
    },
  };
}
