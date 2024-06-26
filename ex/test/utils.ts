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
