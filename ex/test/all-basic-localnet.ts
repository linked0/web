import * as fs from "fs";
import * as path from "path";

import { expect } from "chai";
import { BytesLike, TypedDataDomain } from "ethers";
import { ethers, network } from "hardhat";
const {
  encodeBytes32String,
  decodeBytes32String,
  id,
  parseUnits,
  dataSlice,
  getBytes,
  concat,
  hexlify,
  keccak256,
  MaxUint256,
  randomBytes,
  Transaction,
  TransactionResponse,
  toQuantity,
  toBeHex,
  toUtf8Bytes,
  Wallet,
  zeroPadValue } = ethers;
import {
  ExecAccount,
  Operator,
  AllPairVault,
  Lock,
  AllBasic
} from "../typechain-types";


const ALLBASIC_JSON_PATH = "../artifacts/contracts/AllBasic.sol/AllBasic.json";

describe("AllPairVault", () => {
  let execAccount: ExecAccount;
  let operator: Operator;
  let deployer;
  let allBasic: AllBasic;
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  describe("AllBasic", function () {
    this.beforeEach(async () => {
      allBasic = await ethers.deployContract("AllBasic");
      await allBasic.waitForDeployment();
    });

    it("get value", async function () {
      expect(await allBasic.getValue()).to.equal(1n);
    });

    it("should create a new lock", async () => {
      const [time1, time2] = await allBasic.getLockTime();
      expect(time1).to.equal(0);
      expect(time2).to.equal(0);

      await allBasic.createLock();
      await allBasic.createLockCreationCode();

      // This doesn't work in localnet, local pooh-geth
      // await network.provider.request({ method: "evm_mine" });
      // const [time3, time4] = await allBasic.getLockTime();
      // expect(time3).to.equal(1);
      // expect(time4).to.equal(2);
    });
  });
});