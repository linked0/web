import hre from "hardhat";
import { Contract, Signer } from "ethers";
import * as fs from "fs";
import * as path from "path";
import { AllBasic } from "../../src/allbasic";

const ALLBASIC_JSON_PATH = "../../src/abis/AllBasic.json";
const filePath = path.resolve(__dirname, ALLBASIC_JSON_PATH);
const abiJson = fs.readFileSync(filePath, 'utf8');
const abiData = JSON.parse(abiJson);

export async function fullSuiteFixture() {
  const [owner] = await hre.ethers.getSigners();

  // get contract factory with abi and bytecode
  const factory = await hre.ethers.getContractFactory(abiData.abi, abiData.bytecode, owner);
  const allBasicContract = await factory.deploy();
  const allBasic = new AllBasic(owner, allBasicContract.target);

  return {
    accounts: {
      owner,
    },
    suiteBasic: { allBasic },
  };
}