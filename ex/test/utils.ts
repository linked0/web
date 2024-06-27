import { randomBytes as nodeRandomBytes } from "crypto";

import { expect } from "chai";
import { BigNumber, constants, utils } from "ethers-v5";
import { getAddress, keccak256, toUtf8Bytes } from "ethers-v5/lib/utils";

import type { BigNumberish, ContractTransaction } from "ethers";

// Reference:
// /Users/hyunjaelee/work/seaport/test/utils/encoding.ts
const hexRegex = /[A-Fa-fx]/g;

export const toHex = (n: BigNumberish, numBytes: number = 0) => {
  const asHexString = BigNumber.isBigNumber(n)
    ? n.toHexString().slice(2)
    : typeof n === "string"
      ? hexRegex.test(n)
        ? n.replace(/0x/, "")
        : Number(n).toString(16)
      : Number(n).toString(16);
  return `0x${asHexString.padStart(numBytes * 2, "0")}`;
};

export const toBN = (n: BigNumberish) => BigNumber.from(toHex(n));

export const buildOrderStatus = (
  ...arr: Array<BigNumber | number | boolean>
) => {
  const values = arr.map((v) => (typeof v === "number" ? toBN(v) : v));
  return ["isValidated", "isCancelled", "totalFilled", "totalSize"].reduce(
    (obj, key, i) => ({
      ...obj,
      [key]: values[i],
      [i]: values[i],
    }),
    {}
  );
};

// Define a base User type
export type User = {
  id: string;
  name: string;
};

// Define two specific user types
export type BasicUser = User & {
  type: 'basic';
};

export type AdminUser = User & {
  type: 'admin';
};

// Define a generic Account type
export type Account<TUser extends User> = {
  accountId: string;
  owner: TUser;
};

// Define two specific account types
export type BasicAccount = Account<BasicUser>;
export type AdminAccount = Account<AdminUser>;

// Define operation overrides for demonstration
export type OperationOverrides = {
  dryRun?: boolean;
};

// Define a utility type to get default parameters for an account
export type GetAccountParameter<TAccount, DefaultAccount> = TAccount extends Account<any> ? TAccount : DefaultAccount;

export type TransferAccountOwnershipParams<
  TUser extends User = User,
  TAccount extends Account<TUser> | undefined = Account<TUser> | undefined,
  TOperationOverrides extends OperationOverrides = OperationOverrides
> = {
  newOwner: TUser;
  waitForConfirmation?: boolean;
} & GetAccountParameter<TAccount, Account<TUser>> &
  TOperationOverrides;


export type Hex = `0x${string}`

type TakeBytesOpts = {
  count?: number;
  offset?: number;
};

/**
 * Given a bytes string, returns a slice of the bytes
 *
 * @param bytes - the hex string representing bytes
 * @param opts - optional parameters for slicing the bytes
 * @param opts.offset - the offset in bytes to start slicing from
 * @param opts.count - the number of bytes to slice
 * @returns the sliced bytes
 */
export const takeBytes = (bytes: Hex, opts: TakeBytesOpts = {}): Hex => {
  const { offset, count } = opts;
  const start = (offset ? offset * 2 : 0) + 2; // add 2 to skip the 0x prefix
  const end = count ? start + count * 2 : undefined;

  return `0x${bytes.slice(start, end)}`;
};
