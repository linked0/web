import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Wallet, Signer } from "ethers";
import { BigNumber, constants, utils } from "ethers";
import { ExecAccount, Operator, TooBig, AllPairVault, Lock } from '../typechain';
import { defaultAbiCoder, hexConcat, arrayify, hexlify, hexValue, formatBytes32String } from 'ethers/lib/utils';
import { buildOrderStatus } from "./utils";

import { fullSuiteFixture } from "./full-suite.fixture";
import type { FullSuiteFixtures } from "./full-suite.fixture";
import { libraries } from "../typechain/contracts";

describe.only("AllPairVault", () => {
  let allBasic: FullSuiteFixtures["allBasic"];
  const provider = ethers.provider;

  let execAccount: ExecAccount;
  let operator: Operator;
  let signer: Signer;

  beforeEach(async () => {
    const execAccountFactory = await ethers.getContractFactory("ExecAccount");
    execAccount = await execAccountFactory.deploy();
    const operatorFactory = await ethers.getContractFactory("Operator");
    operator = await operatorFactory.deploy();
    signer = provider.getSigner()
  });

  describe("AllBasic", function () {
    before(async () => {
      ({ allBasic } = await fullSuiteFixture());
    });

    it("get value", async function () {
      console.log("AllBasic address: ", allBasic.address);
      expect(await allBasic.getValue()).to.equal(1n);
    });
  });

  describe("Typscript grammar", () => {
    it("should be able to call deep.equal", async () => {
      const expected = {
        '0': BigNumber.from(1),
        '1': BigNumber.from(2),
        '2': BigNumber.from(3),
        '3': BigNumber.from(4),
        isValidated: BigNumber.from(1),
        isCancelled: BigNumber.from(2),
        totalFilled: BigNumber.from(3),
        totalSize: BigNumber.from(4)
      };
      expect(buildOrderStatus(1, 2, 3, 4)).to.deep.equal(expected);
    });
  });

  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      console.log(execAccount.address);
      expect(await execAccount.test()).to.equal("Hello World!");
    });

    it("#test and #test2", async () => {
      expect(await execAccount.test()).to.equal("Hello World!");
      expect(await execAccount.test2()).to.equal(true);
    });

    it("#executeUserOp", async () => {
      const execSig = operator.interface.getSighash('add');
      const innerCall = defaultAbiCoder.encode(['address', 'bytes'], [operator.address,
      operator.interface.encodeFunctionData('add')
      ]);
      const userOp = {
        sender: operator.address,
        callData: hexConcat([execSig, innerCall])
      }

      // check event
      const message = "Got it!";
      const encodedMessage = ethers.utils.toUtf8Bytes(message);
      const hashedMessage = ethers.utils.keccak256(encodedMessage);
      console.log(hashedMessage);

      await expect(execAccount.executeUserOp(userOp, 1)).to.emit(execAccount, "Executed").withArgs("Got it!", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(2);
    });

    it("#executeMultipleUserOps", async () => {
      const execSig = operator.interface.getSighash('add');
      const innerCall = defaultAbiCoder.encode(['address', 'bytes'], [operator.address,
      operator.interface.encodeFunctionData('add')
      ]);
      const userOp = {
        sender: operator.address,
        callData: hexConcat([execSig, innerCall])
      }
      const userOp2 = {
        sender: operator.address,
        callData: hexConcat([execSig, innerCall])
      }

      // check event
      const message = "Got it two!";
      const encodedMessage = ethers.utils.toUtf8Bytes(message);
      const hashedMessage = ethers.utils.keccak256(encodedMessage);

      await expect(execAccount.executeMultipleUserOps([userOp, userOp2], [1, 2])).to.emit(execAccount, "Executed").withArgs("Got it two!", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(3);
    });

    it("#executeIndirect", async () => {
      const execSig = execAccount.interface.getSighash('indirectInnerCall(bytes)');
      const innerCall = defaultAbiCoder.encode(['address', 'bytes'], [operator.address,
      operator.interface.encodeFunctionData('addTen')
      ]);
      const userOp = {
        sender: operator.address,
        callData: hexConcat([execSig, innerCall])
      }

      // check event
      const message = "Indirect";
      const encodedMessage = ethers.utils.toUtf8Bytes(message);
      const hashedMessage = ethers.utils.keccak256(encodedMessage);

      await expect(execAccount.executeIndirect(userOp, 1)).to.emit(execAccount, "Executed").withArgs("Indirect", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(11);
    });
  });

  describe("ListSetStore", () => {
    let allPairVault: AllPairVault;
    let lock: Lock;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;
    const lockedAmount = ONE_GWEI;

    beforeEach(async () => {
      const latestTime = await time.latest();
      const unlockTime = await time.latest() + ONE_YEAR_IN_SECS;
      const Lock = await ethers.getContractFactory("Lock");
      lock = await Lock.deploy(unlockTime, {
        value: lockedAmount
      });

      const LinkedListSetStore = await ethers.getContractFactory("LinkedListSetLib");
      const linkedListSetLib = await LinkedListSetStore.deploy();
      linkedListSetLib.deployed();

      const AllPairVault = await ethers.getContractFactory("AllPairVault", { libraries: { LinkedListSetLib: linkedListSetLib.address } });
      allPairVault = await AllPairVault.deploy(lock.address);
    });

    it("add and contains", async function () {
      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "Example description"
      };

      const tx = await allPairVault.addValue(valueData);
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      const hexValue = utils.hexlify(valueData.value);
      const hexValue30 = utils.hexZeroPad(hexValue, 30);
      expect(await allPairVault.contains(arrayify(hexValue30))).to.equal(true);
    });

    it("add with checking event", async function () {
      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "Example description"
      };

      expect(await allPairVault.addValue(valueData))
        .to.emit(allPairVault, "ValueAdded")
        .withArgs(valueData.value, valueData.description);
    });

    it("add with revert", async function () {
      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: ""
      };

      await expect(allPairVault.addValue(valueData))
        .to.be.revertedWith("E000");
    });
  });
});