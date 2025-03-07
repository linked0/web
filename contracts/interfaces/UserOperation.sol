// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/* solhint-disable no-inline-assembly */

/**
  * @title UserOperation
  * @dev UserOperation struct.
  * @param sender the sender of the transaction.
  * @param sender-verified signature over the entire request.
  */
struct UserOperation {
    address sender;
    bytes signature;
}

/**
  * Utility functions helpful when working with UserOperation struct.
 */
library UserOperationLib {
  function getSender(
    UserOperation calldata userOp
  ) internal pure returns (address) {
    address data;
    // read sender from userOp, which is first userOp member (saves 800 gas...)
    assembly {
      data := calldataload(userOp)
    }
    return address(uint160(data));
  }
}