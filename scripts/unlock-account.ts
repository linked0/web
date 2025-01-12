// call unlockAccount of geth

import chain, { assert, expect } from "chai";
import { Wallet } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const provider = ethers.provider;
  const unlockAccount = process.env.UNLOCK_ACCOUNT || "";
  const password = process.env.PRIVATE_KEY_PASSWORD || "";
  console.log("UNLOCK_ACCOUNT: ", unlockAccount);

  const accounts = await provider.send("eth_accounts", []);
  console.log("Accounts: ", accounts);

  // send unlockAccount request
  const unlock = await provider.send("personal_unlockAccount", [
    unlockAccount.toLowerCase(),
    password,
    60000,
  ]);
  console.log(unlock);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
