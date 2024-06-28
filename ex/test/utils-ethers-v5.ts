import { ethers } from 'ethers-v5'
import { BigNumber, BigNumberish, Contract, ContractReceipt, Signer, Wallet } from 'ethers-v5'
import {
  arrayify,
  hexConcat,
  hexlify,
  hexZeroPad,
  Interface,
  keccak256,
  parseEther
} from 'ethers-v5/lib/utils'

export const AddressZero = ethers.constants.AddressZero
export const HashZero = ethers.constants.HashZero
export const ONE_ETH = parseEther('1')
export const TWO_ETH = parseEther('2')
export const FIVE_ETH = parseEther('5')