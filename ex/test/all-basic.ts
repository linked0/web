import * as fs from "fs";
import * as path from "path";

import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { GasCostPlugin } from "ethers";
import { Wallet, Signer, BigNumber, constants, utils } from "ethers-v5";
import {
  defaultAbiCoder,
  hexConcat,
  arrayify,
  hexlify,
  hexValue,
  formatBytes32String,
  hexDataSlice,
  keccak256,
  serializeTransaction,
  UnsignedTransaction,
  toUtf8Bytes
} from "ethers-v5/lib/utils";
import { ethers, network } from "hardhat";
import * as zksync from "zksync-web3";

import {
  ExecAccount,
  Operator,
  TooBig,
  AllPairVault,
  Lock,
} from "../typechain-types";
import { libraries, AllBasic } from "../typechain-types/contracts";

import { fillSignAndPack } from "./UserOp";
import { PackedUserOperation, Transaction, UserOperation } from './UserOperation'
import { fullSuiteFixture } from "./full-suite.fixture";
import { buildOrderStatus, TransferAccountOwnershipParams, BasicUser, BasicAccount, AdminUser, takeBytes } from "./utils";
import exp from "constants";
import { send } from "process";


const ALLBASIC_JSON_PATH = "../artifacts/contracts/AllBasic.sol/AllBasic.json";

// NOTE: Refer this code later
// /Users/hyunjaelee/work/account-abstraction/node_modules/zksync-web3/src/utils.ts
// Compute the raw transaction: https://docs.ethers.org/v5/cookbook/transactions/#cookbook--compute-raw-transaction

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

  // describe.only("Code Test", () => {
  describe("Code Test", () => {
    it.skip("should test code", async () => {
      const max = constants.MaxUint256;
      const hafMax = max.div(2);
      const hafMaxPlusOne = hafMax.add(1);
      console.log("max: ", max.toString());
      console.log("hafMax: ", hafMax.toString());
      console.log("hafMaxPlusOne: ", hafMaxPlusOne.toString());

      const textToHex = (text: string) => hexlify(toUtf8Bytes(text));
      const JAY = textToHex("Jay");
      const DATA = textToHex("Hello World! Otani is the best! Jay is the best! All the best!");
    });
  });

  describe("AllBasic", function () {
    it("get value", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);
      expect(await allBasic.getValue()).to.equal(1n);
    });

    it("contract size", async function () {
      const filePath = path.resolve(__dirname, ALLBASIC_JSON_PATH);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(rawData);

      console.log('Assembly Contract Bytecode Length: ', jsonData.deployedBytecode.length / 2);

    });

    it("should create a new lock", async () => {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);
      const [time1, time2] = await allBasic.getLockTime();
      expect(time1).to.equal(0);
      expect(time2).to.equal(0);

      await allBasic.createLock();
      await allBasic.createLockCreationCode();
      await network.provider.request({ method: "evm_mine" });

      const [time3, time4] = await allBasic.getLockTime();
      expect(time3).to.equal(1);
      expect(time4).to.equal(2);
    });

    it("#hexify #arrayify #hexValue", async () => {
      // #hexify & #hexValue
      const number = 255;
      const hexString = utils.hexlify(number);
      expect(typeof hexString).to.equal("string");
      expect(hexString).to.equal("0xff");

      const byteArray = [0, 1, 2, 3];
      const hexStr = utils.hexlify(byteArray);
      expect(hexStr).to.equal("0x00010203");

      const hexValueStr = utils.hexValue(byteArray);
      expect(hexValueStr).to.equal("0x10203");

      // #arrayify
      const sigStr = "calculatePower(uint256,uint256)";
      const functionHash = hexDataSlice(keccak256(toUtf8Bytes(sigStr)), 0, 4);
      const args = utils.defaultAbiCoder.encode(["uint256", "uint256"], [10, 3]);
      const data = functionHash + args.slice(2);
      const dataArray = utils.arrayify(data);
      const expected = new Uint8Array([
        249, 121, 242, 105, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 3
      ]);
      expect(dataArray).to.deep.equal(expected);

      // #hexValue
      const shortString = "Hello, World!";
      const bytes32Formatted = utils.formatBytes32String(shortString);
      expect(bytes32Formatted).to.equal(("0x48656c6c6f2c20576f726c642100000000000000000000000000000000000000").toLowerCase());

    });

    it("#calculatePower", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      await allBasic.calculatePower(10, 2);
      await network.provider.request({ method: "evm_mine" });
      expect(await allBasic.getValue()).to.equal(100);
    });

    it("#simulateValidation", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      const userOp = await fillSignAndPack();
      const valResult = await allBasic.simulateValidation(userOp);

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

  describe("Deposit contract", () => {
    const DEPOSIT_CONTRACT_ADDRESS = "0x0420420420420420420420420420420420420420";
    // Example deposit parameters
    const withdrawalCredentials = utils.hexlify(utils.randomBytes(32)); // Replace with actual withdrawal credentials
    const signature = utils.hexlify(utils.randomBytes(96)); // Replace with actual signature

    it("deposit contract", async function () {
      const depositContract = await ethers.getContractAt("DepositContract", DEPOSIT_CONTRACT_ADDRESS);
      // console.log("depositContract: ", depositContract);

      // NOTE: If you want to test this, use localnet network.
      // console.log("deposit count: ", await depositContract.get_deposit_count());

      // const deployer = new Wallet(process.env.ADMIN_KEY || "");
      // const pubkey = deployer.publicKey;
      // console.log(pubkey, withdrawalCredentials, signature);

      // const pubkeyBytes = utils.hexlify(pubkey);
      // const amount = utils.parseUnits("32", 9); // 32 ETH in Gwei

      // const signatureBytes = utils.arrayify(signature);
      // const pubkeyRoot = utils.sha256(pubkeyBytes + utils.hexZeroPad("0x", 16).substring(2));
      // const signatureRoot = utils.sha256(
      //   utils.sha256(signatureBytes.slice(0, 64)) +
      //   utils.sha256(signatureBytes.slice(64) + utils.hexZeroPad("0x", 32).substring(2))
      // );
      // const node = utils.sha256(
      //   ethers.sha256(pubkeyRoot + withdrawalCredentials.substring(2)) +
      //   ethers.sha256(amount + utils.hexZeroPad("0x", 24).substring(2) + signatureRoot.substring(2))
      // );

      // console.log("pubkey: ", pubkey);
      // console.log("withdrawalCredentials: ", withdrawalCredentials);
      // console.log("signature: ", signature);
      // console.log("node: ", node);
      // const tx = await depositContract.deposit(pubkey, withdrawalCredentials, signature, node, {
      //   value: ethers.parseEther("32") // 32 ETH
      // });

      // console.log("Transaction Hash:", tx.hash);

      // // Wait for the transaction to be mined
      // const receipt = await tx.wait();
    });
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

      const signedMsg = await ownerWallet.signMessage(serializeTransaction(tx));
      console.log("signedMsg: ", signedMsg);
      const sig = ethers.Signature.from(signedMsg);

      // Serialize the signed transaction
      const raw = serializeTransaction(tx, sig);
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
      const functionHash = hexDataSlice(keccak256(toUtf8Bytes(sigStr)), 0, 4);
      // const functionHash = utils.id(sigStr).slice(0, 10);

      const args = utils.defaultAbiCoder.encode(["uint256", "uint256"], [10, 3]);
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
      const functionHash = utils.id(sigStr).slice(0, 10);
      const args = utils.defaultAbiCoder.encode(["uint256", "uint256"], [10, 9]);
      const data = functionHash + args.slice(2);
      const tx = {
        to: allBasic.target,
        data: data,
        gasLimit: 4000000,
        gasPrice: 1000000000,
        nonce: 8,
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
      const data = utils.id(sigStr).slice(0, 10);
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

    it("should log resolved value", async () => {
      // Define the function fetchData
      function fetchData(): Promise<string> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve("Hello, TypeScript!");
          }, 10); // If it's too long, the log will not be shown.
        });
      }

      // Use ReturnType to get the return type of fetchData
      type FetchDataReturnType = ReturnType<typeof fetchData>;
      // FetchDataReturnType is inferred as Promise<string>

      // Use Awaited<T> to get the resolved type of the promise
      type ResolvedType = Awaited<FetchDataReturnType>;
      // ResolvedType is inferred as string

      // Example function using Awaited<T>
      async function logResolvedValue<T>(promise: Promise<T>): Promise<void> {
        const resolvedValue: Awaited<T> = await promise;
        console.log(resolvedValue);
      }

      // Test the function with fetchData
      const dataPromise = fetchData();
      logResolvedValue(dataPromise); // Logs "Hello, TypeScript!" after 1 second
    });

    it("generic type example", async () => {
      // Example with explicit types
      type BasicAccountOwnershipTransfer = TransferAccountOwnershipParams<BasicUser, BasicAccount>;

      const transferDetails: BasicAccountOwnershipTransfer = {
        newOwner: { id: 'u123', name: 'Alice', type: 'basic' },
        accountId: 'a456',
        owner: { id: 'u456', name: 'Bob', type: 'basic' },
        waitForConfirmation: true,
        dryRun: false // `OperationOverrides` from utility type
      };
      console.log(transferDetails);

      // Example using default types
      type AdminAccountOwnershipTransfer = TransferAccountOwnershipParams<AdminUser>;

      const adminTransferDetails: AdminAccountOwnershipTransfer = {
        newOwner: { id: 'u789', name: 'Eve', type: 'admin' },
        accountId: 'a789',
        owner: { id: 'u890', name: 'Frank', type: 'admin' },
        waitForConfirmation: true,
        dryRun: true // `OperationOverrides` from utility type
      };
      console.log(adminTransferDetails);
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
  });
});
