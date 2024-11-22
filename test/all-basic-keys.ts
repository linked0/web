import * as fs from "fs";
import * as path from "path";

import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { BytesLike, TypedDataDomain, Signature } from "ethers";
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
  zeroPadValue,
} = ethers;
import {
  ExecAccount,
  Operator,
  AllPairVault,
  Lock,
  AllBasic,
} from "../typechain-types";

import { fillSignAndPack } from "./UserOp";
import { fullSuiteFixture } from "./full-suite.fixture";

const ALLBASIC_JSON_PATH = "../artifacts/contracts/AllBasic.sol/AllBasic.json";

describe("Random Keys", () => {
  let execAccount: ExecAccount;
  let operator: Operator;
  let deployer;
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  beforeEach(async () => {
    execAccount = await ethers.deployContract("ExecAccount");
    execAccount.waitForDeployment();
    operator = await ethers.deployContract("Operator");
    operator.waitForDeployment();
    [deployer] = await ethers.getSigners();
  });

  it("create a new key", async () => {
    const wanted = 10;
    for (let i = 0; i < wanted; i++) {
      const wallet = ethers.Wallet.createRandom();
      console.log(wallet.privateKey, wallet.address); // This is your private key
    }
  });
});
