import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

let deployer: HardhatEthersSigner;
let user: HardhatEthersSigner;

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const execAccount = await ethers.deployContract("ExecAccount");

  return {
    accounts: {
      deployer,
      user,
    },
    suite: {
      execAccount,
    },
  };
}