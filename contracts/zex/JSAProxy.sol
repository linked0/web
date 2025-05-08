// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "./JaySmartAccount.sol";

/// @notice Your proxy; all logic lives in JaySmartAccount
contract JSAProxy is TransparentUpgradeableProxy {
  /// @param _logic   address of JaySmartAccount implementation
  /// @param _admin   address of ProxyAdmin (or any admin)
  /// @param _data    initialization calldata
  constructor(
    address _logic,
    address _admin,
    bytes memory _data
  ) TransparentUpgradeableProxy(_logic, _admin, _data) {}
}
