import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

import { AllBasic__factory } from "../typechain-types";

let deployer: HardhatEthersSigner;
let user: HardhatEthersSigner;

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const ERC20Factory = await ethers.getContractFactory("MyToken");
  const erc20 = await ERC20Factory.deploy();

  const TrasactionDelegatorFactory = await ethers.getContractFactory(
    "TransactionDelegator"
  );
  const delegator = await TrasactionDelegatorFactory.deploy(erc20.target);

  const {
    suiteAllPairVault: { allPairVault, lock },
  } = await associatedLinkedListSetFixture();

  const {
    suiteBasic: { allBasic },
  } = await allBasicFixture();

  const owner = deployer;
  return {
    accounts: {
      deployer,
      owner,  // Actually deployer !!!
      user,
    },
    suite: {
      erc20,
      delegator,
    },
    suiteAllPairVault: { allPairVault, lock },
    suiteBasic: { allBasic },
  };
}

async function associatedLinkedListSetFixture() {
  const [deployer, user] = await ethers.getSigners();

  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  const lock = await ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });
  const linkedListSetLib = await ethers.deployContract("LinkedListSetLib");
  const allPairVault = await ethers.deployContract(
    "AllPairVault",
    [lock.target],
    {
      libraries: {
        LinkedListSetLib: linkedListSetLib.target,
      },
    }
  );

  return {
    suiteAllPairVault: {
      lock,
      allPairVault,
    },
  };
}

async function allBasicFixture() {
  const [deployer, user] = await ethers.getSigners();

  const allBasic = await ethers.deployContract("AllBasic");

  return {
    suiteBasic: {
      allBasic,
    },
  };
}
