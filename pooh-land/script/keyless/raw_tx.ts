import * as ethUtil from "ethereumjs-util";
import { Transaction } from 'ethereumjs-tx';
import { bufferToHex } from 'ethereumjs-util';
import { NonceManager } from "@ethersproject/experimental";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { expect } from "chai";
import { BigNumber, BigNumberish, constants, Contract, ContractReceipt, ContractTransaction, Wallet } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";
import * as ethUtil from 'ethereumjs-util';
import "@nomiclabs/hardhat-web3";

import {
    BoaTestERC1155,
    ConduitInterface,
    ConsiderationInterface,
    EIP1271Wallet__factory,
    Seaport,
    TestERC1155,
    TestERC20,
    TestERC721,
    TestZone,
} from "../../typechain-types";
import { simpleBoaBalance, simpleWBoaBalance, setAssetContract, setWBoaContract } from "../../utils/CommonFunctions";
import { GasPriceManager } from "../../utils/GasPriceManager";
const { orderType } = require("../../eip-712-types/order");

const { parseEther, keccak256 } = ethers.utils;
const provider = ethers.provider;

async function getAddress() {
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(admin));
    // const signer = new ethers.Signer(process.env.ADMIN_KEY);
    
    // Parse the sample raw transaction
    const rawTx = "0xf87e8085174876e800830186a08080ad601f80600e600039806000f350fe60003681823780368234f58015156014578182fd5b80825250506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222";
    console.log(`Raw Transaction 1: ${rawTx}`);
    const tx = new Transaction(rawTx, { chain: 'mainnet' });

    // Recover the sender's address
    const senderAddress = tx.getSenderAddress().toString('hex');

    // Extract v, r, s values
    console.log(`Sender Address: 0x${senderAddress}\n`);

    // Parse the first raw transaction
    const tx0 = {
      nonce: "0x00",
      gasPrice: "0x09184e72a000",
      gasLimit: "0x27100",
      to: "0x0000000000000000000000000000000000000000",
      value: "0x00",
      data: "0x60003681823780368234f58015156014578182fd5b80825250506014600cf3",  
      // v: "0x603d", // 0x603d, 0x1b
      // r: "0x0000000001000000000000000000000001000000000000000000000000100000",
      // s: "0x1212121212121212121212121212121212121212121212121212121212121212",
    };

    // const tx2 = new Transaction(tx0, { chain: 'mainnet' });
    const signedTransaction = await admin.signTransaction(tx0);
    const msgHash = ethUtil.keccak256(ethUtil.toBuffer(signedTransaction));
    console.log(`v: ${signedTransaction.v}`);
    console.log(`r: ${signedTransaction.r}`);
    console.log(`s: ${signedTransaction.s}`);
    console.log(`signed tx: ${signedTransaction}`);

    const v = ethUtil.toBuffer("0x1b");
    const r = ethUtil.toBuffer("0x0000000001000000000000000000000001000000000000000000000000100000");
    const s = ethUtil.toBuffer("0x1212121212121212121212121212121212121212121212121212121212121212");
    const addressRecovered = ethUtil.ecrecover(msgHash, v, r, s);
    console.log(`Recoverd Address: 0x${addressRecovered}\n`);
}

async function main() {
  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const adminSigner = new NonceManager(new GasPriceManager(admin));

  const nonce = await provider.getTransactionCount(admin.address);
  const balance = await provider.getBalance(admin.address);
  console.log(`Nonce: ${nonce}`);
  console.log(`Balance: ${balance.toString()}`);

  const nonceOwner = await provider.getTransactionCount("0x8B595d325485a0Ca9d41908cAbF265E23C172847");
  const balanceOwner = await provider.getBalance("0x8B595d325485a0Ca9d41908cAbF265E23C172847");
  console.log(`Owner Nonce: ${nonceOwner}`);
  console.log(`Owner Balance: ${balanceOwner.toString()}`);

  // await getAddress();
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

