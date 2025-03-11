// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/UserOperation.sol";

// Forge formatter will displace the first comment for the enum field out of the enum itself,
// so annotating here to prevent that.
// forgefmt: disable-start

/// @dev A struct holding fields to describe the plugin in a purely view contract. Intented form front end clients.
struct PluginManifest {
  string name;
  // The version of the plugin, following the semantic versioning scheme.
  uint256 version;
  // The author field SHOULD be a username reprsenting the identity of the user or organization
  // that created the plugin.
  string author;
  // The reserve fields of 32 bytes is reserved for future use.
  bytes32[] reserves;
  // IPlugin's interface ID.
  bytes4[] interfaceIds;
}

interface IPlugin {
  /// @notice Describe the metadata of the plugin.
  /// @dev This metadata MUST stay constant over time
  /// @return A mesifest describing the contents and intended configuration of the plugin.
  function pluginManifest() external pure returns (PluginManifest memory);
}
