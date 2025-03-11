// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {EnumerableMap} from "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import {IPlugin} from "../interfaces/IPluginJay.sol";
import {FunctionReference} from "../interfaces/IPluginManagerJay.sol";

// bytes = keccak256("PooNet.JaySmartAccount.Storage")
bytes32 constant _ACCOUNT_STORAGE_SLOT = 0x4db8fa2acc4d6a94d467aa8982e1932e59070f8d0d223abcf9396b1d7ba82598;

struct PluginData {
  bool anyExternalExecPermitted;
  // boolean to indicate if the plugin can spend native tokes, if any of the execution function can spend
  // native tokens, a plugin is considered to be able to spend native tokens of the accounts
  bool canSpendNativeToken;
  bytes32 manifestHash;
  FunctionReference[] dependencies;
  // Tracks the number of times the plugin has been used as a dependency function
  uint256 dependencyCount;
}

struct AccountStorage {
  // AccountStorageIntializable variables
  uint8 initialized;
  bool initializing;
  // Plugin metadata storage
  EnumerableSet.AddressSet plugins;
  mapping(address => PluginData) pluginData;
  // Execution functions and their associated functions
  // mapping(bytes4 => SelectorData) selectorData;
  // bytes24 key = address(calling plugin) || target address
  mapping(bytes24 => bool) callPermitted;
  // key = address(calling plugin) || target address
  // mapping(IPlugin => mapping(address => PermittedExternalCallData)) permittedExternalCalls;
  // For ERC165 intrspection
  mapping(bytes4 => uint256) supportedInterfaces;
}

function getAccountStorage() pure returns (AccountStorage storage _storage) {
  assembly ("memory-safe") {
    _storage.slot := _ACCOUNT_STORAGE_SLOT
  }
}
