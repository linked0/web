import * as fs from "fs";
import * as path from "path";

import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { BytesLike, TypedDataDomain } from "ethers";
import { Wallet, constants, utils } from "ethers-v5";
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
  randomBytes,
  Transaction,
  toQuantity,
  toBeHex,
  toUtf8Bytes,
  zeroPadValue } = ethers;
import {
  ExecAccount,
  Operator,
  AllPairVault,
  Lock,
  AllBasic
} from "../typechain-types";

import { fillSignAndPack } from "./UserOp";
import { fullSuiteFixture } from "./full-suite.fixture";
import { buildOrderStatus, TransferAccountOwnershipParams, BasicUser, BasicAccount, AdminUser } from "./utils";


const ALLBASIC_JSON_PATH = "../artifacts/contracts/AllBasic.sol/AllBasic.json";

/**********************************************************************************
// NOTE; ethers v5 -> v6
// AddressZero -> ZeroAddress
// HashZero -> ZeroHash
// arrayify -> getBytes
// hexConcat -> concat
// hexValue -> toQuantity
// hexDataSlice -> dataSlice
// hexZeroPad -> - zeroPadValue
// hexlify(value: BytesLike | Hexable | number | bigint)
//    -> hexlify(value: BytesLike) No longer works on numbers
//    -> toBeHex for numbers
// solidityPack -> solidityPacked
// Web3Provider -> BrowserProvider
// splitSignature -> https://github.com/ethers-io/ethers.js/discussions/4370
// checkProperties, shallowCopy -> The checkProperties and shallowCopy have been removed in favor of using .map and Object.assign.
// formatBytes32String -> encodeBytes32String
// parseBytes32String -> decodeBytes32String
// serializeTransaction(tx) -> Transaction.from(tx).serialized
// parseTransaction(txBytes) -> Transaction.from(txBytes)

// NOTE: Refer this code later
// /Users/hyunjaelee/work/account-abstraction/node_modules/zksync-web3/src/utils.ts
// Compute the raw transaction: https://docs.ethers.org/v5/cookbook/transactions/#cookbook--compute-raw-transaction
***********************************************************************************/


describe("AllPairVault", () => {
  let execAccount: ExecAccount;
  let operator: Operator;
  let deployer;
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  beforeEach(async () => {
    const execAccountFactory = await ethers.getContractFactory("ExecAccount");
    execAccount = await execAccountFactory.deploy();
    const operatorFactory = await ethers.getContractFactory("Operator");
    operator = await operatorFactory.deploy();
    [deployer] = await ethers.getSigners();
  });

  describe("#signTransaction", function () {
    const filePath = path.resolve(__dirname, ALLBASIC_JSON_PATH); // Adjust the path if necessary
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);

    it("Should deploy contract", async function () {
      const allBasic = await ethers.deployContract("AllBasic");
      console.log("AllBasic address: ", allBasic.target);
    });

    it("Should deploy operator with bytecode", async function () {
      const [owner, spender] = await ethers.getSigners();

      const tx = {
        data: jsonData.bytecode,
        gasLimit: 4000000,
        gasPrice: 1000000000,
      }

      const txResponse = await owner.sendTransaction(tx);
      const receipt = await txResponse.wait(); // Wait for the transaction to be mined
      console.log("Contract deployed at address:", receipt.contractAddress);
    });

    // NOTE: poohnet으로 실행하면 에러가 발생함. 왜냐하면 poohnet은 evmVersion이 cancun이 아니므로,
    // 쫑 날수 있으므로 hardhat.config.ts의 compiler 부분의 evmVersion: "cancun"을 제거해야함.
    it("Should create contract creation transaction", async function () {
      const ownerWallet = new Wallet(process.env.ADMIN_KEY || "");
      const [owner, spender] = await ethers.getSigners()

      const tx = {
        data: jsonData.bytecode,
        gasLimit: 4000000,
        gasPrice: 1000000000,
        nonce: 3,
      }

      const signedTx = await ownerWallet.signTransaction(tx);
      console.log("!!! UNCOMMENT code to see signed transaction !!!");
      // console.log(`cast publish --rpc-url http://localhost:8545 ${signedTx}`);
    });

    // NOTE: (code: -32000, message: insufficient funds for gas * price + value: balance 0, tx cost 100000000000000000, overshot 100000000000000000, data: None)
    // 사인한 트랜잭션을 만드는 것에 오류가 있는 것을 보임. 
    it.skip("Should create contract creation transaction", async function () {
      const owner = new Wallet(process.env.ADMIN_KEY || "");
      // print balance of owner
      console.log("balance:", await ethers.provider.getBalance(owner.address));

      const nonce = ethers.toBeArray(4);
      const gasPrice = ethers.toBeArray(100 * 10 ** 9);
      const gasLimit = ethers.toBeArray(1000000);
      const to = ethers.toBeArray(0);
      const value = ethers.toBeArray(0);
      const data = ethers.getBytes(jsonData.bytecode);

      const unsignedEncodedTx = ethers.encodeRlp([nonce, gasPrice, gasLimit, to, value, data]);
      // const hashedUnsignedEncodedTx = ethers.keccak256(ethers.getBytes(unsignedEncodedTx));
      const sigStr = await owner.signMessage(unsignedEncodedTx);
      console.log("Signature: ", sigStr);
      const sig = ethers.Signature.from(sigStr);
      console.log("type of r: ", typeof sig.r);
      const signedEncodedTx = ethers.encodeRlp([nonce, gasPrice, gasLimit, to, value, data, ethers.toBeArray(sig.v), ethers.getBytes(sig.r), ethers.getBytes(sig.s)]);
      const signedEncodedTxBytes = ethers.getBytes(signedEncodedTx);
      const raw = signedEncodedTxBytes.reduce((x, y) => x += y.toString(16).padStart(2, '0'), '')
      console.log(`cast publish --rpc-url http://localhost:8545 0x${raw}`);
    });

    // NOTE: (code: -32000, message: insufficient funds for gas * price + value: balance 0, tx cost 100000000000000000, overshot 100000000000000000, data: None)
    // 사인한 트랜잭션을 만드는 것에 오류가 있는 것을 보임. 
    it.skip("Should create contract creation transaction - BAK", async function () {
      const ownerWallet = new Wallet(process.env.ADMIN_KEY || "");
      console.log("ownerWallet: ", ownerWallet.address);
      // const spender = new Wallet(process.env.USER_KEY || "");
      const [owner, spender] = await ethers.getSigners();

      const tx = {
        data: jsonData.bytecode,
        gasLimit: 4000000,
        gasPrice: 1000000000,
        nonce: 4,
      }

      const signedMsg = await ownerWallet.signMessage(Transaction.from(tx).serialized);
      console.log("signedMsg: ", signedMsg);
      const sig = ethers.Signature.from(signedMsg);

      // Serialize the signed transaction
      const sigTx = {
        ...tx,
        v: sig.v,
        r: sig.r,
        s: sig.s,
      }
      const raw = Transaction.from(sigTx).serialized;
      console.log(`cast publish --rpc-url http://localhost:8545 ${raw}`);
    });

    it("Should approve and verify transactions", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      // NotImplementedError: Method 'HardhatEthersSigner.signTransaction' is not implemented
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
      //   from: owner.address,
      //   to: spender.address,
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

    it("should add call with sendTransaction", async () => {
      const {
        accounts: { owner },
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);
      const sigStr = "calculatePower(uint256,uint256)";

      // There is two ways to get functionHash
      const functionHash = dataSlice(keccak256(toUtf8Bytes(sigStr)), 0, 4);
      // const functionHash = id(sigStr).slice(0, 10);

      const args = abiCoder.encode(["uint256", "uint256"], [10, 3]);
      const data = functionHash + args.slice(2);
      const tx = {
        to: allBasic.target,
        data: data,
      };
      const ret = await owner.sendTransaction(tx);
      await ret.wait();
      expect(await allBasic.getValue()).to.equal(1000);

      // Second call
      const dataTwo = await allBasic.calculatePower.populateTransaction(10, 4);
      const retTwo = await owner.sendTransaction(dataTwo);
      await retTwo.wait();
      expect(await allBasic.getValue()).to.equal(10000);
    });

    it("should add call with eth_sendRawTransaction", async () => {
      const {
        suiteBasic: { allBasic }
      } = await loadFixture(fullSuiteFixture);
      const owner = new Wallet(process.env.ADMIN_KEY || "");

      const sigStr = "calculatePower(uint256,uint256)";
      const functionHash = id(sigStr).slice(0, 10);
      const args = abiCoder.encode(["uint256", "uint256"], [10, 9]);
      const data = functionHash + args.slice(2);
      const tx = {
        to: allBasic.target,
        data: data,
        gasLimit: 4000000,
        gasPrice: 1000000000,
        nonce: 9,
      };
      const signedTx = await owner.signTransaction(tx);
      const ret = await ethers.provider.send('eth_sendRawTransaction', [signedTx])
      expect(await allBasic.getValue()).to.equal(1000000000);
    });

    it("should add call with eth_call", async () => {
      const {
        suiteBasic: { allBasic }
      } = await loadFixture(fullSuiteFixture);
      const owner = new Wallet(process.env.ADMIN_KEY || "");
      await allBasic.calculatePower(10, 5);

      const sigStr = "getValue()";
      const data = id(sigStr).slice(0, 10);
      const tx = {
        to: allBasic.target,
        data: data,
      };
      const stateOverride = {
        [allBasic.target]: {
          code: jsonData.deployedBytecode
        }
      }
      const ret = await ethers.provider.send('eth_call', [tx, 'latest', stateOverride])
      const [decodeResult] = allBasic.interface.decodeFunctionResult("getValue", ret);
      expect(decodeResult).to.equal(100000);
    });
  });
});
