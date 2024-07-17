import {
  Contract, Signer
} from "ethers";
import * as fs from "fs";
import * as path from "path";
import hre from "hardhat";

const ALLBASIC_JSON_PATH = "../src/abis/AllBasic.json";
const filePath = path.resolve(__dirname, ALLBASIC_JSON_PATH);
const rawData = fs.readFileSync(filePath, 'utf8');
const jsonData = JSON.parse(rawData);

export class AllBasic {
  public contract: Contract;

  public constructor(signer: Signer, address: string) {
    this.contract = new Contract(address, jsonData.abi, signer);
  }

  public async getValue(): Promise<bigint> {
    const value = await this.contract.getValue();
    return value;
  }
}