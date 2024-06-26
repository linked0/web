import { ALLBASIC_ABI } from "../src/abis/AllBasic";
import { ALLBASIC_BYTECODE } from "../src/abis/AllBasic";
import { ethers } from "ethers-v5";
import hre from "hardhat";

export class AllBasic {
  public contract: ethers.Contract;

  public constructor(address: string) {
    this.contract = new ethers.Contract(address, ALLBASIC_ABI);
  }
}