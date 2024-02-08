import { ethers } from "hardhat";
import { zeroPadValue, hexlify, toBeHex, keccak256, concat } from "ethers";
import { TransactionRequest } from '@ethersproject/abstract-provider'

async function main() {
    const signer = await ethers.provider.getSigner();
    console.log("Signer address:", await signer.getAddress());

    const create2Factory = await ethers.getContractAt("Create2Factory", process.env.CREATE2FACTORY_ADDRESS);
    // print transaction of factory deployment
    console.log("Create2Factory deployed to:", create2Factory.target);

    // deploy lock contract with create2Factory
    const initCode = await (await ethers.getContractFactory("Lock3")).getDeployTransaction(1);
    
    let initCodeStr: string = "";
    if (typeof initCode !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        initCodeStr = (initCode as TransactionRequest).data!.toString()
        // console.log('@@@ initCodeStr:', initCodeStr)
    }
    const addr = getDeployedAddress(initCodeStr, 3);
    console.log("SimpleStorage deployed to:", addr);

    const deployTx = {
      to: process.env.CREATE2FACTORY_ADDRESS,
      data: initCodeStr
    }

    // let gasLimit = await signer.estimateGas(deployTx);

    // manual estimation (its bit larger: we don't know actual deployed code size)
    // if (gasLimit === undefined) {
    //   gasLimit = arrayify(initCodeStr)
    //     .map(x => x === 0 ? 4 : 16)
    //     .reduce((sum, x) => sum + x) +
    //     200 * initCode.length / 2 + // actual is usually somewhat smaller (only deposited code, not entire constructor)
    //     6 * Math.ceil(initCode.length / 64) + // hash price. very minor compared to deposit costs
    //     32000 +
    //     21000

    //   // deployer requires some extra gas
    //   gasLimit = Math.floor(gasLimit * 64 / 63)
    // }

    const gasLimit = 1000000;
    console.log("Gas estimate:", gasLimit.toString());

    const ret = await signer.sendTransaction({ ...deployTx, gasLimit })
    await ret.wait()
    if (await ethers.provider.getCode(addr).then(code => code.length) === 2) {
      throw new Error('failed to deploy')
    }
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