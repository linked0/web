// call unlockAccount of geth

import chain, { assert, expect } from "chai";
import { Wallet } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers } from "hardhat";

import { BYTECODE0X } from "../test/all-basic-data";

async function main() {
  const provider = ethers.provider;
  const adminWallet = new Wallet(process.env.ADMIN_KEY || "", provider);

  const byteCode = BYTECODE0X;
  console.log("## BYTECODE: ", byteCode);
  const salt = ethers.keccak256(ethers.toUtf8Bytes("MyProject:UniqueID"));
  const saltHex = ethers.zeroPadValue(salt, 32);

  // get deterministic proxy address from ethers
  const deployer = "0x4e59b44847b379578588920cA78FbF26c0B4956C";
  const address = ethers.getCreate2Address(
    deployer,
    saltHex,
    ethers.keccak256(byteCode)
  );
  console.log("## Address: ", address);

  // check the size of the contract from the address
  const contractSize = await ethers.provider.getCode(address);
  console.log("## Contract Size: ", contractSize.length / 2);

  // if the contract size is 0, deploy the contract
  if (contractSize.length <= 1) {
    const txData = ethers.concat([saltHex, byteCode]);
    const tx = await adminWallet.sendTransaction({
      to: deployer,
      data: txData,
    });
    await tx.wait();

    // Check the contract size again
    const contractSize2 = await ethers.provider.getCode(address);
    console.log("## Contract Size2: ", contractSize2.length / 2);
  }

  // Call the contract function, banana()
  const txData2 = "0xc3cafc6f"; // ethers.id("banana()").slice(0, 10);
  console.log("## txData2: ", txData2);
  const result = await adminWallet.call({
    to: address,
    data: txData2,
    gasLimit: 3000000, // Optional
  });

  console.log("## Result of eth_call: ", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
