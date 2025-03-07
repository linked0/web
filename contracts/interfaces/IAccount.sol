// SPDX-License-Identifier: MIT

import "./UserOperation.sol";

interface IAccount {
  /**
    * Validate user's signature and nonce.
    * the entryPoint will make the call to the recipient only if this validation call returns successfully.
    * signature failure should be reported by returning SIG_VALIDATION_FAILED (1).
    * This allows making a "simulation call" without a valid signature
    * Other failures (e.g. nonce mismatch, or invalid singature format) should still revert to signal failure.
    *
    * @dev Must validate calle is the entryPoint.
    *      Must validate the signature and nonce
    * @param userOp the operation that is about to be executed.
    * @param userOpHash ths hash of the user's request data. can be used as the basis for signature.
    * @return validationData packaged ValidationData structure.
   */
  function validateUserOp(
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) external returns (uint256 validationData);
}