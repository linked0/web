// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/IPluginJay.sol";

/// @title BasicPlugin
/// @notice A sample plugin implementation that derives from IPlugin.
contract BasicPlugin is IPlugin {
  /// @notice Returns the plugin manifest which contains the list of supported interface IDs.
  /// @dev The returned manifest is constant and includes a sample ERC-165 interface ID.
  /// @return manifest A PluginManifest struct with the supported interface IDs.
  function pluginManifest()
    external
    pure
    override
    returns (PluginManifest memory manifest)
  {
    // Set the basic details of the plugin.
    manifest.name = "BasicPlugin";
    manifest.version = "1.0.0";
    manifest.author = "ZEX";

    // Create an array of bytes4 with one dummy interface ID.
    bytes4[] memory interfaceIds = new bytes4[](1);
    bytes32[] memory reserves = new bytes32[](1);

    // Example: 0x01ffc9a7 is the ERC-165 interface ID for the basic plugin interface
    interfaceIds[0] = 0x01ffc9a7;

    // Add a reserved value generated from hashing the name, version, and author
    reserves[0] = keccak256(
      abi.encodePacked(manifest.name, manifest.version, manifest.author)
    );

    // Assign the generated arrays to the manifest
    manifest.interfaceIds = interfaceIds;
    manifest.reserves = reserves;
  }
}
