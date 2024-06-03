import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const ERC20Factory = await ethers.getContractFactory("MyToken");
  const erc20 = await ERC20Factory.deploy();

  const TrasactionDelegatorFactory = await ethers.getContractFactory(
    "TransactionDelegator",
  );
  const delegator = await TrasactionDelegatorFactory.deploy(erc20.target);

  return {
    accounts: {
      deployer,
      user,
    },
    suite: {
      erc20,
      delegator,
    },
  };
}
