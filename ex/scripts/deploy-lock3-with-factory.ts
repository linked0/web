import { ethers } from "hardhat";
import { zeroPadValue, hexlify, toBeHex, keccak256, concat } from "ethers";
import { TransactionRequest } from '@ethersproject/abstract-provider'

async function main() {
    const create2Factory = await ethers.getContractAt("Create2Factory", process.env.CREATE2FACTORY_ADDRESS);
    // print transaction of factory deployment
    console.log("Create2Factory deployed to:", create2Factory.target);

    // deploy lock contract with create2Factory
    const initCode = await (await ethers.getContractFactory("Lock3")).getDeployTransaction(1);
    
    // console.log('@@@ initCode:', initCode)
    
    let initCodeStr: string = "";
    if (typeof initCode !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        initCodeStr = (initCode as TransactionRequest).data!.toString()
        // console.log('@@@ initCodeStr:', initCodeStr)
    }

    const addr = getDeployedAddress(initCodeStr, 9999);
    console.log("SimpleStorage deployed to:", addr);
  }

  function getDeployedAddress (initCode: string, salt: number): string {
    const saltBytes32 = toBeHex(salt, 32)
    const FACTORY_ADDRESS=process.env.CREATE2FACTORY_ADDRESS || "";
    // console.log('saltBytes32:', saltBytes32)
    // console.log('initCode:', initCode)
    // console.log('keccak256(initCode):', keccak256(initCode))
    // console.log('concat:', concat([
    //     '0xff',
    //     FACTORY_ADDRESS,
    //     saltBytes32,
    //     keccak256(initCode)
    //   ]).toString());

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