// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {BasePlugin} from "@erc6900/plugins/BasePlugin.sol";
import {PluginMetadata} from "@erc6900/interfaces/IPlugin.sol";

contract BaseTestPlugin is BasePlugin {
    // Don't need to implement this in each context
    function pluginMetadata()
        external
        pure
        virtual
        override
        returns (PluginMetadata memory)
    {
        revert NotImplemented();
    }
}
