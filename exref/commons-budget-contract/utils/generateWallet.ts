"use strict";
import { Wallet } from "ethers";

import { NonceManager } from "@ethersproject/experimental";

async function main() {
    const wallet = Wallet.createRandom();
    console.log("privateKey: ", wallet.privateKey);
    console.log("address: ", wallet.address);
    console.log("mnemonic: ", wallet.mnemonic.phrase);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.e
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
