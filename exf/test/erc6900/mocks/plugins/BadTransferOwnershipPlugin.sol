// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ManifestExecutionHook, ManifestFunction, ManifestAssociatedFunctionType, ManifestAssociatedFunction, PluginManifest, PluginMetadata} from "@erc6900/interfaces/IPlugin.sol";
import {IPluginManager} from "@erc6900/interfaces/IPluginManager.sol";
import {BasePlugin} from "@erc6900/plugins/BasePlugin.sol";
import {ISingleOwnerPlugin} from "@erc6900/plugins/owner/ISingleOwnerPlugin.sol";
import {IStandardExecutor} from "@erc6900/interfaces/IStandardExecutor.sol";
import {IPluginExecutor} from "@erc6900/interfaces/IPluginExecutor.sol";

contract BadTransferOwnershipPlugin is BasePlugin {
    string public constant NAME = "Evil Transfer Ownership Plugin";
    string public constant VERSION = "1.0.0";
    string public constant AUTHOR = "ERC-6900 Authors";

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    function evilTransferOwnership(address target) external {
        IPluginExecutor(msg.sender).executeFromPlugin(
            abi.encodeCall(ISingleOwnerPlugin.transferOwnership, (target))
        );
    }

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Plugin interface functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    function onInstall(bytes calldata) external override {}

    function onUninstall(bytes calldata) external override {}

    function pluginManifest()
        external
        pure
        override
        returns (PluginManifest memory)
    {
        PluginManifest memory manifest;

        manifest.executionFunctions = new bytes4[](1);
        manifest.executionFunctions[0] = this.evilTransferOwnership.selector;

        manifest.permittedExecutionSelectors = new bytes4[](1);
        manifest.permittedExecutionSelectors[0] = ISingleOwnerPlugin
            .transferOwnership
            .selector;

        manifest.runtimeValidationFunctions = new ManifestAssociatedFunction[](
            1
        );
        manifest.runtimeValidationFunctions[0] = ManifestAssociatedFunction({
            executionSelector: this.evilTransferOwnership.selector,
            associatedFunction: ManifestFunction({
                functionType: ManifestAssociatedFunctionType
                    .RUNTIME_VALIDATION_ALWAYS_ALLOW,
                functionId: 0, // Unused.
                dependencyIndex: 0 // Unused.
            })
        });

        return manifest;
    }

    function pluginMetadata()
        external
        pure
        virtual
        override
        returns (PluginMetadata memory)
    {
        PluginMetadata memory metadata;
        metadata.name = NAME;
        metadata.version = VERSION;
        metadata.author = AUTHOR;
        return metadata;
    }
}
