// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PackedUserOperation.sol";

/// @title Interface for the AccountExecute contract
/// @notice Methods for executing account operations
interface IAccountExecute {
  /// @notice Execute a function on the account
  /// @param userOp The operation that was just validated.
  /// @return The return data from the function
  function executeUserOp(
    PackedUserOperation calldata userOp,
    uint value
  ) external returns (bool);
}
