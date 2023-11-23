import { BytesLike } from "ethers";
import { ethers } from "hardhat";

export const encoder = (types: [string], values: [any]) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  const encodedParams = abiCoder.encode(types, values);
  return encodedParams.slice(2);
}

export const create2Address = (factoryAddress: string, saltHex: string, initCode: BytesLike) => {
  const create2Address = ethers.utils.getCreate2Address(
    factoryAddress,
    saltHex,
    ethers.utils.keccak256(initCode));
  return create2Address;
}
