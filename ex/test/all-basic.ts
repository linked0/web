import * as fs from "fs";
import * as path from "path";

import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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

import { fillSignAndPack } from "./UserOp";
import { fullSuiteFixture } from "./full-suite.fixture";
import { buildOrderStatus, TransferAccountOwnershipParams, BasicUser, BasicAccount, AdminUser } from "./utils";
import { PackedUserOperationStruct } from "../typechain-types/contracts/AllBasic";
import { deployContract } from "@nomicfoundation/hardhat-ethers/types";


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
// populateTransaction -> <contract>.<function>.populateTransaction() 이런 식으로 사용

// ethers.utils.id -> ethers.id

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

  describe("Code Test", () => {
    it("should test code", async () => {
      const max = MaxUint256;
      const hafMax = max / 2n; // max.div(2);
      const hafMaxPlusOne = hafMax + 1n; //hafMax.add(1);
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

      // NOTE: CHECK THIS CODE
      const userOp = await fillSignAndPack() as PackedUserOperationStruct;
      const valResult = await allBasic.simulateValidation(userOp);
    });

    it("#abi.encodeWithSignature #callFriend #setFriend", async function () {
      const {
        suiteBasic: { allBasic, friend },
      } = await loadFixture(fullSuiteFixture);

      await allBasic.setFriend(friend.target);
      await allBasic.callFriendWithSignature(256, "Hello, World!");
      expect(await friend.storedValue()).to.equal(256);
      expect(await friend.storedMessage()).to.equal("Hello, World!");
    });

    it("#encodeData #decodeData #bytes parameter", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      // Example interaction
      const encodedData = await allBasic.encodeData(42, "Hello, Hardhat!");
      const madeData = abiCoder.encode(
        ["uint256", "string"],
        [42, "Hello, Hardhat!"]
      );
      expect(encodedData).to.equal(madeData);

      const decodedData = await allBasic.decodeData(madeData);
      expect(decodedData[0]).to.equal(42);
      expect(decodedData[1]).to.equal("Hello, Hardhat!");
    });

    it("#hashMessage #verify #splitSignature", async function () {
      const {
        accounts: { owner },
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      const domain: TypedDataDomain = {
        name: "MyDApp",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: allBasic.target as string | null | undefined,
      };

      const types = {
        Message: [
          { name: "from", type: "address" },
          { name: "content", type: "string" },
        ],
      };

      const value = {
        from: owner.address,
        content: "Hello, Hardhat!",
      };

      const signature = await owner.signTypedData(domain, types, value);
      console.log("Signature:", signature);

      const isValid = await allBasic.verify(owner.address, value, signature);
      expect(isValid).to.be.true;
    });

    it("#revertNowhere", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      const _value = 1;

      const sigStr = "InvalidMsgValue(uint256)";
      const errorSelector = id(sigStr).slice(0, 10);
      const encodedError = abiCoder.encode(
        ["uint256"],
        [_value]
      );
      const expectedRevert = `${errorSelector}${encodedError.slice(2)}`;
      console.log("expectedRevert: ", expectedRevert);

      // NOTE: 일단 AllBasic.sol에 `error InvalidMsgValue(uint256 value);`를 추가해서
      // 해결했지만, 이게 열심히 assembly로 만들어진 코드를 테스트하는 것이라고 생각하면
      // 이렇게 하는 것이 맞는 것인지 의문이 든다. 추후에 다시 확인해봐야 할 것 같다.
      await expect(allBasic.revertNowhere({ value: _value })).to.be.revertedWithCustomError(allBasic as AllBasic, "InvalidMsgValue").withArgs(1);;
    });

    it("#getByte", async () => {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      expect(await allBasic.getByte(2)).to.equal('0x01');
    });
  });
  describe("Ethers utils", () => {
    it("#hexify #arrayify #hexValue", async () => {
      // #hexify & #hexValue
      const number = 255;
      const hexString = toBeHex(number);
      expect(typeof hexString).to.equal("string");
      expect(hexString).to.equal("0xff");

      const byteArray = new Uint8Array([0, 1, 2, 3]);
      const hexStr = hexlify(byteArray);
      expect(hexStr).to.equal("0x00010203");

      const hexValueStr = toQuantity(byteArray);
      // NOTE: ethers v5에서는 hexValue를 사용함.
      // const hexValueStr = utils.hexValue(byteArray);
      expect(hexValueStr).to.equal("0x10203");

      // #arrayify
      const sigStr = "calculatePower(uint256,uint256)";
      const functionHash = dataSlice(keccak256(toUtf8Bytes(sigStr)), 0, 4) as string;
      console.log("## sig hash for calculatePower: ", functionHash);
      const args = abiCoder.encode(["uint256", "uint256"], [10, 3]);
      const data = functionHash + args.slice(2);
      const dataArray = getBytes(data);
      const expected = new Uint8Array([
        249, 121, 242, 105, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 3
      ]);
      expect(dataArray).to.deep.equal(expected);
    });

    it("#parseUnits", async () => {
      const amount = "10.5"; // 10.5 tokens
      const decimals = 18; // Assume the token has 18 decimal places

      // Convert the amount to Wei using parseUnits
      const amountInWei = parseUnits(amount, decimals);
      expect(amountInWei).to.equal(10500000000000000000n);
    });

    // NOTE: encodedBytes32String in ethers v6 = formatBytes32String 
    it("#formatBytes32String #parseBytes32String", async () => {
      // #hexValue
      const shortString = "Hello, World!";
      const bytes32Formatted = encodeBytes32String(shortString);
      expect(bytes32Formatted).to.equal(("0x48656c6c6f2c20576f726c642100000000000000000000000000000000000000").toLowerCase());

      let decodedString = decodeBytes32String(bytes32Formatted);
      expect(decodedString).to.equal(shortString);
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
      const execSig = keccak256(toUtf8Bytes(functionSignature))
        .substring(0, 10);
      console.log('execSig: ', execSig);
      const innerCall = abiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("add")]
      );
      const userOp = {
        sender: operator.target,
        callData: concat([execSig, innerCall]),
      };

      // check event
      const message = "Got it!";
      const encodedMessage = toUtf8Bytes(message);
      const hashedMessage = keccak256(encodedMessage);
      console.log(hashedMessage);

      await expect(execAccount.executeUserOp(userOp, 1))
        .to.emit(execAccount, "Executed")
        .withArgs("Got it!", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(2);
    });

    // NOTE: Solve this problem now
    it("#executeMultipleUserOps", async () => {
      const functionSignature = "add";
      const execSig = keccak256(toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = abiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("add")]
      );
      const userOp = {
        sender: operator.target,
        callData: concat([execSig, innerCall]),
      };
      const userOp2 = {
        sender: operator.target,
        callData: concat([execSig, innerCall]),
      };

      // check event
      const message = "Got it two!";
      const encodedMessage = toUtf8Bytes(message);
      const hashedMessage = keccak256(encodedMessage);

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
      const execSig = keccak256(toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = abiCoder.encode(
        ["address", "bytes"],
        [operator.target, operator.interface.encodeFunctionData("addTen")]
      );
      const userOp = {
        sender: operator.target,
        callData: concat([execSig, innerCall]),
      };

      // check event
      const message = "Indirect";
      const encodedMessage = toUtf8Bytes(message);
      const hashedMessage = keccak256(encodedMessage);

      await expect(execAccount.executeIndirect(userOp, 1))
        .to.emit(execAccount, "Executed")
        .withArgs("Indirect", hashedMessage);

      // check value of operator
      expect(await operator.value()).to.equal(11);
    });

    it("#executeUserOp with populateTransaction", async () => {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      // 둘 다 동일한 결과를 가져온다.
      // const callAdd = await allBasic.add.populateTransaction().then(tx => tx.data!);
      const tx = await allBasic.add.populateTransaction();
      const callAdd = tx.data!;
      
      const functionSignature = "add";
      const execSig = keccak256(toUtf8Bytes(functionSignature))
        .substring(0, 10);
      const innerCall = abiCoder.encode(
        ["address", "bytes"],
        [allBasic.target, callAdd]
      );
      const userOp = {
        sender: allBasic.target,
        callData: concat([execSig, innerCall]),
      };
      await execAccount.executeUserOp(userOp, 1);
      expect(await allBasic.getValue()).to.equal(1n);
    });

    it("#executeUserOp with populateTransaction ethers.id ", async () => {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      const tx = await allBasic.add.populateTransaction();
      const callAdd = tx.data!;
      const execSig = ethers.id("add()").slice(0, 10);

      console.log(`execSig: ${execSig}, callAdd: ${callAdd}`);
      const innerCall = abiCoder.encode(
        ["address", "bytes"],
        [allBasic.target, callAdd]
      );
      const userOp = {
        sender: allBasic.target,
        callData: concat([execSig, innerCall]),
      };
      await execAccount.executeUserOp(userOp, 1);
      expect(await allBasic.getValue()).to.equal(1n);

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

      const hexValue = toBeHex(valueData.value);
      const hexValue30 = zeroPadValue(hexValue, 30);
      expect(await allPairVault.contains(getBytes(hexValue30))).to.equal(true);
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
    const withdrawalCredentials = hexlify(randomBytes(32)); // Replace with actual withdrawal credentials
    const signature = hexlify(randomBytes(96)); // Replace with actual signature

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

  describe("Typscript grammar", () => {
    it("should be able to call deep.equal", async () => {
      const expected = {
        "0": 1n,
        "1": 2n,
        "2": 3n,
        "3": 4n,
        isValidated: 1n,
        isCancelled: 2n,
        totalFilled: 3n,
        totalSize: 4n,
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
