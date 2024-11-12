import { TransactionRequest } from '@ethersproject/abstract-provider'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { BigNumber, Contract, Signer, Wallet } from 'ethers-v5'
import {
  arrayify,
  defaultAbiCoder,
  hexDataSlice,
  keccak256,
  hexConcat,
  hexZeroPad,
  hexlify,
  toUtf8Bytes
} from 'ethers-v5/lib/utils'
import { ethers } from 'hardhat'

import { PackedUserOperation, UserOperation } from './UserOperation'
import { AddressZero } from './utils-ethers-v5'


export async function packUserOp(userOp: UserOperation): Promise<PackedUserOperation> {
  const gasLimit = hexConcat([
    hexZeroPad(hexlify("0x100", { hexPad: 'left' }), 16), hexZeroPad(hexlify("0x200", { hexPad: 'left' }), 16)
  ])

  const textToHex = (text: string) => hexlify(toUtf8Bytes(text));
  const JAY = textToHex("Jay");
  const DATA = textToHex("Data");

  const paymaster = hexConcat([
    JAY, hexZeroPad(hexlify("0x100", { hexPad: 'left' }), 16),
    hexZeroPad(hexlify("0x200", { hexPad: 'left' }), 16), DATA
  ])
  console.log("gasLimit: ", gasLimit)
  console.log("paymaster: ", paymaster)

  return {
    sender: userOp.sender,
    nonce: userOp.nonce,
    callData: userOp.callData,
    initCode: userOp.initCode,
    preVerificationGas: userOp.preVerificationGas,
    maxFeePerGas: userOp.maxFeePerGas,
    maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
    accountGasLimits: gasLimit,
    paymasterAndData: paymaster,
    signature: userOp.signature
  }
}
export function encodeUserOp(userOp: UserOperation, forSignature = true): string {
  const packedUserOp = packUserOp(userOp)
  if (forSignature) {
    return defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes32', 'bytes32',
        'bytes32', 'uint256', 'uint256', 'uint256',
        'bytes32'],
      [packedUserOp.sender, packedUserOp.nonce, keccak256(packedUserOp.initCode), keccak256(packedUserOp.callData),
      packedUserOp.accountGasLimits, packedUserOp.preVerificationGas, packedUserOp.maxFeePerGas, packedUserOp.maxPriorityFeePerGas,
      keccak256(packedUserOp.paymasterAndData)])
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return defaultAbiCoder.encode(
      ['address', 'uint256', 'bytes', 'bytes',
        'bytes32', 'uint256', 'uint256', 'uint256',
        'bytes', 'bytes'],
      [packedUserOp.sender, packedUserOp.nonce, packedUserOp.initCode, packedUserOp.callData,
      packedUserOp.accountGasLimits, packedUserOp.preVerificationGas, packedUserOp.maxFeePerGas, packedUserOp.maxPriorityFeePerGas,
      packedUserOp.paymasterAndData, packedUserOp.signature])
  }
}

export function getUserOpHash(op: UserOperation, entryPoint: string, chainId: number): string {
  const userOpHash = keccak256(encodeUserOp(op, true))
  const enc = defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPoint, chainId])
  return keccak256(enc)
}

export const DefaultsForUserOp: UserOperation = {
  sender: AddressZero,
  nonce: 0,
  initCode: '0x',
  callData: '0x',
  callGasLimit: 0,
  verificationGasLimit: 150000, // default verification gas. will add create2 cost (3200+200*length) if initCode exists
  preVerificationGas: 21000, // should also cover calldata cost.
  maxFeePerGas: 0,
  maxPriorityFeePerGas: 1e9,
  paymaster: AddressZero,
  paymasterData: '0x',
  paymasterVerificationGasLimit: 3e5,
  paymasterPostOpGasLimit: 0,
  signature: '0x'
}

export function signUserOp(op: UserOperation, signer: Wallet, entryPoint: string, chainId: number): UserOperation {
  const message = getUserOpHash(op, entryPoint, chainId)
  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(message))
  ])

  const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(signer.privateKey)))
  // that's equivalent of:  await signer.signMessage(message);
  // (but without "async"
  const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s)
  return {
    ...op,
    signature: signedMessage1
  }
}

export function fillUserOpDefaults(op: Partial<UserOperation>, defaults = DefaultsForUserOp): UserOperation {
  const partial: any = { ...op }
  // we want "item:undefined" to be used from defaults, and not override defaults, so we must explicitly
  // remove those so "merge" will succeed.
  for (const key in partial) {
    if (partial[key] == null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete partial[key]
    }
  }
  const filled = { ...defaults, ...partial }
  return filled
}

export async function fillSignAndPack(): Promise<PackedUserOperation> {
  return await packUserOp(DefaultsForUserOp)
}
