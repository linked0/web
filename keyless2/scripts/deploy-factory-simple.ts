import { ethers } from "hardhat";
// or specifically just the needed functions
import { zeroPadValue, hexlify, toBeHex, keccak256, concat } from "ethers";
import { Test__factory } from "../typechain-types";
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { log } from "console";

async function main() {
    const signer = await ethers.provider.getSigner();
    console.log("Signer address:", await signer.getAddress());
    const initCode = await new Test__factory(await signer).getDeployTransaction();
    const contract = Test__factory.createInterface();
    console.log('@@@ contract:', contract.)
    console.log('@@@ initCode:', initCode)

    let initCodeStr: string = "";
    if (typeof initCode !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        initCodeStr = (initCode as TransactionRequest).data!.toString()
        console.log('@@@ initCodeStr:', initCodeStr)
    }

    const addr = getDeployedAddress(initCodeStr, 9999);
    console.log("SimpleStorage deployed to:", addr);
}

function getDeployedAddress (initCode: string, salt: number): string {
    const saltBytes32 = toBeHex(salt, 32)
    console.log('saltBytes32:', saltBytes32)
    console.log('initCode:', initCode)
    console.log('keccak256(initCode):', keccak256(initCode))
    const FACTORY_ADDRESS="0xbcB08b651fB6319727c44eE093162764F9A4340A";
    console.log('concat:', concat([
        '0xff',
        FACTORY_ADDRESS,
        saltBytes32,
        keccak256(initCode)
      ]).toString());

    return '0x' + keccak256(concat([
      '0xff',
      FACTORY_ADDRESS,
      saltBytes32,
      keccak256(initCode)
    ])).slice(-40)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
