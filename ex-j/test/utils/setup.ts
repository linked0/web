import { Contract } from "ethers";
import hre from "hardhat";
import { AllBasic } from "../../src/allbasic";
import { ALLBASIC_ABI } from "../../src/abis/AllBasic";
import { ALLBASIC_BYTECODE } from "../../src/abis/AllBasic";

export type Fixture = {
  allBasicContract: Contract;
  allBasic: AllBasic;
};

export const setup = async (): Promise<Fixture> => {
  const [owner, otherAccount] = await hre.ethers.getSigners();
  const fixture: Partial<Fixture> = {};

  // get contract factory with abi and bytecode
  const factory = await hre.ethers.getContractFactory(ALLBASIC_ABI, ALLBASIC_BYTECODE, owner);
  const allBasicContract = await factory.deploy();
  const allBasic = new AllBasic(allBasicContract.target);
  console.log("allBasicContract", allBasicContract.target);
  fixture.allBasic = allBasic;

  return fixture as Fixture;
}