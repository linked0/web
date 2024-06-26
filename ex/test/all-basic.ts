import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { Wallet, Signer, BigNumber, constants, utils } from "ethers-v5";
import {
  defaultAbiCoder,
  hexConcat,
  arrayify,
  hexlify,
  hexValue,
  formatBytes32String,
} from "ethers-v5/lib/utils";
import { ethers } from "hardhat";

import {
  ExecAccount,
  Operator,
  TooBig,
  AllPairVault,
  Lock,
} from "../typechain-types";
import { libraries, AllBasic } from "../typechain-types/contracts";

import { fullSuiteFixture } from "./full-suite.fixture";
import { buildOrderStatus } from "./utils";


describe("AllPairVault", () => {
  let execAccount: ExecAccount;
  let operator: Operator;
  let deployer;

  beforeEach(async () => {
    const execAccountFactory = await ethers.getContractFactory("ExecAccount");
    execAccount = await execAccountFactory.deploy();
    const operatorFactory = await ethers.getContractFactory("Operator");
    operator = await operatorFactory.deploy();
    [deployer] = await ethers.getSigners();
  });

  describe("Code Test", () => {
    const max = constants.MaxUint256;
    const hafMax = max.div(2);
    const hafMaxPlusOne = hafMax.add(1);
    console.log("max: ", max.toString());
    console.log("hafMax: ", hafMax.toString());
    console.log("hafMaxPlusOne: ", hafMaxPlusOne.toString());
  });

  describe("AllBasic", function () {
    it("get value", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      console.log("AllBasic address: ", allBasic.target);
      expect(await allBasic.getValue()).to.equal(1n);
    });
  });

  describe("Typscript grammar", () => {
    it("should be able to call deep.equal", async () => {
      const expected = {
        "0": BigNumber.from(1),
        "1": BigNumber.from(2),
        "2": BigNumber.from(3),
        "3": BigNumber.from(4),
        isValidated: BigNumber.from(1),
        isCancelled: BigNumber.from(2),
        totalFilled: BigNumber.from(3),
        totalSize: BigNumber.from(4),
      };
      expect(buildOrderStatus(1, 2, 3, 4)).to.deep.equal(expected);
    });
  });

  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      console.log(execAccount.target);
      expect(await execAccount.test()).to.equal("Hello World!");
    });

    it("#test and #test2", async () => {
      expect(await execAccount.test()).to.equal("Hello World!");
      expect(await execAccount.test2()).to.equal(true);
    });

    it("#executeUserOp", async () => {
      const functionSignature = "add";
      const execSig = utils
        .keccak256(utils.toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = defaultAbiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("add")]
      );
      const userOp = {
        sender: operator.target,
        callData: hexConcat([execSig, innerCall]),
      };

      // check event
      const message = "Got it!";
      const encodedMessage = utils.toUtf8Bytes(message);
      const hashedMessage = utils.keccak256(encodedMessage);
      console.log(hashedMessage);

      await expect(execAccount.executeUserOp(userOp, 1))
        .to.emit(execAccount, "Executed")
        .withArgs("Got it!", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(2);
    });

    it("#executeMultipleUserOps", async () => {
      const functionSignature = "add";
      const execSig = utils
        .keccak256(utils.toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = defaultAbiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("add")]
      );
      const userOp = {
        sender: operator.target,
        callData: hexConcat([execSig, innerCall]),
      };
      const userOp2 = {
        sender: operator.target,
        callData: hexConcat([execSig, innerCall]),
      };

      // check event
      const message = "Got it two!";
      const encodedMessage = utils.toUtf8Bytes(message);
      const hashedMessage = utils.keccak256(encodedMessage);

      await expect(
        execAccount.executeMultipleUserOps([userOp, userOp2], [1, 2])
      )
        .to.emit(execAccount, "Executed")
        .withArgs("Got it two!", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(3);
    });

    it("#executeIndirect", async () => {
      const functionSignature = "indirectInnerCall(bytes)";
      const execSig = utils
        .keccak256(utils.toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = defaultAbiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("addTen")]
      );
      const userOp = {
        sender: operator.target,
        callData: hexConcat([execSig, innerCall]),
      };

      // check event
      const message = "Indirect";
      const encodedMessage = utils.toUtf8Bytes(message);
      const hashedMessage = utils.keccak256(encodedMessage);

      await expect(execAccount.executeIndirect(userOp, 1))
        .to.emit(execAccount, "Executed")
        .withArgs("Indirect", hashedMessage);

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
      const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
      const Lock = await ethers.getContractFactory("Lock");
      lock = await Lock.deploy(unlockTime, {
        value: lockedAmount,
      });

      const LinkedListSetStore = await ethers.getContractFactory(
        "LinkedListSetLib"
      );
      const linkedListSetLib = await LinkedListSetStore.deploy();

      const AllPairVault = await ethers.getContractFactory("AllPairVault", {
        libraries: { LinkedListSetLib: linkedListSetLib.target },
      });
      allPairVault = await AllPairVault.deploy(lock.target);
    });

    it("add and contains", async function () {
      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "Example description",
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
        description: "Example description",
      };

      expect(await allPairVault.addValue(valueData))
        .to.emit(allPairVault, "ValueAdded")
        .withArgs(valueData.value, valueData.description);
    });

    it("add with revert", async function () {
      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "",
      };

      await expect(allPairVault.addValue(valueData)).to.be.revertedWith("E000");
    });
  });

  describe("#reduce", () => {
    const concatenateArrayElements = (arr: any[]): string => {
      return arr.reduce((acc, curr) => (acc += curr.toString()), "");
    };

    it("should reduce the value", async () => {
      const numArray: number[] = [1, 2, 3, 4, 5];
      const strArray: string[] = ["a", "b", "c", "d"];

      const concatenatedNumString = concatenateArrayElements(numArray);
      const concatenatedStrString = concatenateArrayElements(strArray);

      expect(concatenatedNumString).to.equal("12345");
      expect(concatenatedStrString).to.equal("abcd");
    });
  });

  describe("#signTransaction", function () {
    it("Should approve and verify transactions", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      // const [owner, spender] = await ethers.getSigners();
      const owner = new Wallet(process.env.ADMIN_KEY || "");
      const spender = new Wallet(process.env.USER_KEY || "");

      // Populate the `approve` transaction
      const tx = await allBasic.approve.populateTransaction(
        owner.address,
        spender.address
      );

      // Sign the transaction
      const signedTx = await owner.signTransaction(tx);

      // Parse the signed transaction
      const parsedTx = utils.parseTransaction(signedTx);
      const { v, r, s } = parsedTx;
      console.log("v, r, s: ", v, r, s);

      // NOTE: refer this code later
      // work/pooh-rollup/etc/system-contracts/test/BootloaderUtilities.spec.ts
      // FIX: Error: from address mismatch (argument="transaction", value={"type":2,"to":"0x1811DfdE14b2e9aBAF948079E8962d200E71aCFD","from":"0xE024589D0BCd59267E430fB792B29Ce7716566dF","data":"0x","value":0,"maxFeePerGas":12000,"maxPriorityFeePerGas":100}, code=INVALID_ARGUMENT, version=abstract-signer/5.7.0)
      // const eip1559Tx = await owner.populateTransaction({
      //   type: 2,
      //   to: owner.address,
      //   from: spender.address,
      //   data: "0x",
      //   value: 0,
      //   maxFeePerGas: 12000,
      //   maxPriorityFeePerGas: 100,
      // });
      // const signedEip1559Tx = await owner.signTransaction(eip1559Tx);
      // const parsedEIP1559tx = utils.parseTransaction(signedEip1559Tx);

      // const EIP1559TxData = signedTxToTransactionData(parsedEIP1559tx)!;
      // const signature = utils.arrayify(EIP1559TxData.signature);
      // signature[64] = 0;
      // EIP1559TxData.signature = signature;

      // await expect(bootloaderUtilities.getTransactionHashes(EIP1559TxData)).to.be.revertedWith("Invalid v value");
    });
  });
});
