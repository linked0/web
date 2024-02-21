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
    const initCode = await (await ethers.getContractFactory("Test")).getDeployTransaction();
    
    let initCodeStr: string = "";
    if (typeof initCode !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        initCodeStr = (initCode as TransactionRequest).data!.toString()
        console.log('@@@ initCodeStr:', initCodeStr)
    }
    initCodeStr = "6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212205c308266d3e1e69ef40d52cec3a293b9f93f5962c0b39b8e9bf06874cf47522e64736f6c63430008130033";
    const addr = getDeployedAddress(initCodeStr, 3);
    console.log("SimpleStorage deployed to:", addr);

    // console.log('@@@ initCodeStr:', initCodeStr)

    const deployTx = {
      to: process.env.CREATE2FACTORY_ADDRESS,
      data: getDeployTransactionCallData(initCodeStr, 3)
    }

    let gasLimit = await signer.estimateGas(deployTx);

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

    // const gasLimit = 1000000;
    console.log("Gas estimate:", gasLimit.toString());

    const ret = await signer.sendTransaction({ ...deployTx, gasLimit })
    await ret.wait()
    if (await ethers.provider.getCode(addr).then(code => code.length) === 2) {
      throw new Error('failed to deploy')
    }
  }

  function getDeployTransactionCallData (initCode: string, salt: number = 0): string {
    const saltBytes32 = toBeHex(salt, 32)
    return concat([
      saltBytes32,
      initCode
    ])
  }

  function getDeployedAddress (initCode: string, salt: number): string {
    const saltBytes32 = toBeHex(salt, 32)
    const FACTORY_ADDRESS=process.env.CREATE2FACTORY_ADDRESS || "";
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