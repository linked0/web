// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/* solhit-disable avoid-low-level-calls */
/* sholhint-disable no-empty-blocks */

import "../interfaces/IAccount.sol";
import "hardhat/console.sol";

/**
 * Basic account implementation.
 * this contract provides the basic logic for implementing the IAccount interface - validateUserOp
 * specific account implementations should inherit from this contract and provide the account-specific logic
 */
abstract contract BaseAccount is IAccount {
  using UserOperationLib for UserOperation;

  // return value in case of signature failure, with no time-range.
  // equivalent to _packValiationData(true, 0Ba, 0);
  uint256 internal constant SIG_VALIDATION_FAILED = 1;

  /**
   * Validate user's signature and nonce.
   * subclass doesn't need to override this method. Instead, it should override the specific internal validation method.
   */
  function validateUserOp( 
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) external virtual override returns (uint256 validationData) {
    console.log("BaseAccount: validateUserOp");
    return _validateSignature(userOp, userOpHash);
  }

  function _validateSignature(
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) internal virtual returns (uint256 validationData);
}
