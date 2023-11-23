import * as fs from "fs";
import * as hre from "hardhat";
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';
import { join } from "path";
import { ethers } from "hardhat";

// import { NonceManager } from "@ethersproject/experimental";
// import {Account} from "web3-core";

async function main() {
    const curFolder = process.cwd();
    const filePath = curFolder + "/keystore/keystore.json";
    const data = fs.readFileSync(filePath).toString();
    console.log(data);
    const account = await hre.ethers.Wallet.fromEncryptedJson(data, "boa2022!@");
    console.log("Address:", account.address);
    console.log("Public Key:", account._signingKey().compressedPublicKey);
    console.log("Private Key:", account._signingKey().privateKey);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.e
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});