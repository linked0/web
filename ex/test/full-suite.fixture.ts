import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
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
  const delegator = await TrasactionDelegatorFactory.deploy(erc20.target);

  const {
    suiteListSet: { listSetStore }
  } = await associatedLinkedListSetFixture();

  return {
    accounts: {
      deployer,
      user,
    },
    suite: {
      erc20,
      delegator,
    },
    suiteListSet: { listSetStore }
  };
}

async function associatedLinkedListSetFixture() {
  const [deployer, user] = await ethers.getSigners();

  const linkedListSetLib = await ethers.deployContract("LinkedListSetLib");
  console.log("LinkedListSetLib address: ", linkedListSetLib.target);
  const listSetStore = await ethers.deployContract("ListSetStore",
    {
      libraries: {
        LinkedListSetLib: linkedListSetLib.target,
      },
    });

  return {
    suiteListSet: {
      listSetStore
    },
  };
}