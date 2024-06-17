// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title User Operation struct
/// @dev A struct representing a user operation
/// @param sender The address of the sender
/// @param initCode The init code for the contract
/// @param callData The call data for the contract
/// @param signature
/// @param data
struct PackedUserOperation {
  address sender;
  bytes callData;
}
