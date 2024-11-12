import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, artifacts } from "hardhat";

import { AllBasic__factory } from "../typechain-types";

let deployer: HardhatEthersSigner;
let user: HardhatEthersSigner;

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const MyTokenArtifact = await artifacts.readArtifact("contracts/archive/MyToken.sol:MyToken");
  const MyTokenFactory = new ethers.ContractFactory(MyTokenArtifact.abi, MyTokenArtifact.bytecode, deployer);

  // NOTE: You can use this commented code to deploy the contract as above
  // const MyTokenFactory = await ethers.getContractFactory("contracts/archive/MyToken.sol:MyToken");
  const erc20 = await MyTokenFactory.deploy();

  const TrasactionDelegatorFactory = await ethers.getContractFactory(
    "TransactionDelegator"
  );
  const delegator = await TrasactionDelegatorFactory.deploy(erc20.target);

  const allBasic = await ethers.deployContract("AllBasic");
  const friend = await ethers.deployContract("AllBasicFriend");

  const {
    suiteAllPairVault: { allPairVault, lock },
  } = await associatedLinkedListSetFixture();

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
    suiteBasic: { allBasic, friend },
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

