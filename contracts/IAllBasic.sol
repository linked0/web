// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PackedUserOperation.sol";
import "./IEntryPoint.sol";
interface IAllBasic is IEntryPoint {
  /**
   * Successful result from simulateValidation.
   * If the account returns a signature aggregator the "aggregatorInfo" struct is filled in as well.
   * @param returnInfo     Gas and time-range returned values
   * @param senderInfo     Stake information about the sender
   * @param factoryInfo    Stake information about the factory (if any)
   * @param paymasterInfo  Stake information about the paymaster (if any)
   * @param aggregatorInfo Signature aggregation info (if the account requires signature aggregator)
   *                       Bundler MUST use it to verify the signature, or reject the UserOperation.
   */
  struct ValidationResult {
    ReturnInfo returnInfo;
    StakeInfo senderInfo;
  }

  /**
   * Simulate a call to account.validateUserOp and paymaster.validatePaymasterUserOp.
   * @dev This method always reverts. Successful result is ValidationResult error. other errors are failures.
   * @dev The node must also verify it doesn't use banned opcodes, and that it doesn't reference storage
   *      outside the account's data.
   * @param userOp - The user operation to validate.
   */
  function simulateValidation(
    PackedUserOperation calldata userOp
  ) external returns (ValidationResult memory);
}
