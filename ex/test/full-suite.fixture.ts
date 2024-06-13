import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

let deployer: HardhatEthersSigner;
let user: HardhatEthersSigner;

export async function fullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const ERC20Factory = await ethers.getContractFactory("MyToken");
  const erc20 = await ERC20Factory.deploy();

  const TrasactionDelegatorFactory = await ethers.getContractFactory(
    "TransactionDelegator",
  );
  const delegator = await TrasactionDelegatorFactory.deploy(erc20.address);
  console.log("Delegator address: ", delegator.address);

  const {
    suiteAllPairVault: { allPairVault, lock }
  } = await associatedLinkedListSetFixture();

  const {
    suiteBasic: { allBasic }
  } = await allBasicFixture();

  console.log("allBasic address in Fixture: ", allBasic.address);

  return {
    deployer,
    user,
    erc20,
    delegator,
    allPairVault,
    lock,
    allBasic
  };
}

async function associatedLinkedListSetFixture() {
  const [deployer, user] = await ethers.getSigners();

  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const ONE_GWEI = 1_000_000_000;

  const lockedAmount = ONE_GWEI;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  const lockFactory = await ethers.getContractFactory("Lock");
  const lock = await lockFactory.deploy(unlockTime, {
    value: lockedAmount,
  });
  console.log("lock address: ", lock.address);

  const LiknedListFactory = await ethers.getContractFactory("LinkedListSetLib");
  const linkedListSetLib = await LiknedListFactory.deploy();

  const AllPairFactory = await ethers.getContractFactory("AllPairVault", {
    libraries: {
      LinkedListSetLib: linkedListSetLib.address
    }
  });
  const allPairVault = await AllPairFactory.deploy(lock.address);

  return {
    suiteAllPairVault: {
      lock,
      allPairVault
    },
  };
}

async function allBasicFixture() {
  const [deployer, user] = await ethers.getSigners();

  const allBasicFactory = await ethers.getContractFactory("AllBasic");
  const allBasic = await allBasicFactory.deploy();

  return {
    suiteBasic: {
      allBasic
    },
  };
}

export type FullSuiteFixtures = Awaited<ReturnType<typeof fullSuiteFixture>>;