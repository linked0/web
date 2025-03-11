// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/UserOperation.sol";
import "./BaseAccount.sol";
import "../utils/Logger.sol";
import "../interfaces/IPluginJay.sol";
import "hardhat/console.sol";

import {AccountStorage, getAccountStorage} from "./AccountStorage.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title MySmartAccount
 * @dev MySmartAccount contract.
 * This contract provides the specific logic for implementing the IAccount interface - validateUserOp
 */
contract JaySmartAccount is BaseAccount, Logger {
  using EnumerableSet for EnumerableSet.AddressSet;

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    Errors                         ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  error PluginVersionMismatch();

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    Events                         ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  event UserOpParsed(address sender, bytes signature);

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    Storage Variables              ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  uint256 public store = 0;

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    External & Public functions    ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  function getStore() public view returns (uint256) {
    return store;
  }

  function getSigValidationFailed() public pure returns (uint256) {
    return SIG_VALIDATION_FAILED;
  }

  function setStore(uint256 _store) public {
    pushLog("setStore", _store);
    store = _store;
  }

  function installPlugin(
    address plugin,
    bytes32 manifestHash,
    PluginManifest calldata manifest,
    bytes calldata pluginInstallData
  ) external {
    _installPlugin(plugin, manifestHash, manifest, pluginInstallData);
  }

  function getPluginAddress(uint256 index) public view returns (address) {
    AccountStorage storage _storage = getAccountStorage();
    require(_storage.plugins.length() > 0, "No plugins available");
    return _storage.plugins.at(0);
  }

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    Internal functions             ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  function _validateSignature(
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) internal virtual override returns (uint256 validationData) {
    // Validate the signature:
    // return SIG_VALIDATION_FAILED if invalid, or 0 if valid.
    return 0;
  }

  function multiUserOp(bytes memory userOps) public {
    uint iterationCount;
    assembly {
      let totalLen := mload(userOps)
      let offset := add(userOps, 0x20)
      let end := add(offset, totalLen)
      let count := 0
      for {

      } lt(offset, end) {
        count := add(count, 1)
      } {
        let sender := shr(96, mload(offset))
        offset := add(offset, 20)
        let sigLen := mload(offset)
        offset := add(offset, 0x20)
        let sigData := offset
        offset := add(offset, sigLen)
      }
      iterationCount := count
    }
    pushLog("multiUserOp", iterationCount);
  }

  function _installPlugin(
    address plugin,
    bytes32 manifestHash,
    PluginManifest calldata manifest,
    bytes calldata pluginInstallData
  ) internal {
    PluginManifest memory manifestPlugin = IPlugin(plugin).pluginManifest();
    if (manifest.version != manifestPlugin.version) {
      revert PluginVersionMismatch();
    }

    AccountStorage storage _storage = getAccountStorage();
    _storage.plugins.add(plugin);
  }
}
