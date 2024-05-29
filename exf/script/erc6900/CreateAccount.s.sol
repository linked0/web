// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Script} from "forge-std/Script.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";
import {SingleOwnerPlugin} from "@erc6900/plugins/owner/SingleOwnerPlugin.sol";
import {UpgradeableModularAccount} from "@erc6900/account/UpgradeableModularAccount.sol";
import {console} from "forge-std/Test.sol";

contract CreateAccount is Script {
    bytes32 private immutable _PROXY_BYTECODE_HASH;

    constructor() {
        address modularAccount = vm.envAddress(
            "UPGRADEABLE_MODULAR_ACCOUNT_ADDRESS"
        );
        _PROXY_BYTECODE_HASH = keccak256(
            abi.encodePacked(
                type(ERC1967Proxy).creationCode,
                abi.encode(address(modularAccount), "")
            )
        );
    }

    function run() external returns (address) {
        address owner = vm.envAddress("OWNER");
        uint256 salt = vm.envUint("SALT");
        console.log("owner:", owner);
        console.log("salt:", salt);

        address accountImplementation = vm.envAddress(
            "UPGRADEABLE_MODULAR_ACCOUNT_ADDRESS"
        );
        address singleOwnerPluginAddr = vm.envAddress(
            "SINGLE_OWNER_PLUGIN_ADDRESS"
        );
        SingleOwnerPlugin singleOwnerPlugin = SingleOwnerPlugin(
            singleOwnerPluginAddr
        );

        address addr = Create2.computeAddress(
            getSalt(owner, salt),
            _PROXY_BYTECODE_HASH
        );

        vm.startBroadcast();
        // short circuit if exists
        if (addr.code.length == 0) {
            address[] memory plugins = new address[](1);
            plugins[0] = address(singleOwnerPlugin);
            bytes32[] memory pluginManifestHashes = new bytes32[](1);
            pluginManifestHashes[0] = keccak256(
                abi.encode(singleOwnerPlugin.pluginManifest())
            );
            bytes[] memory pluginInstallData = new bytes[](1);
            pluginInstallData[0] = abi.encode(owner);
            // not necessary to check return addr since next call will fail if so
            new ERC1967Proxy{salt: getSalt(owner, salt)}(
                address(accountImplementation),
                ""
            );
        }
        vm.stopBroadcast();
        return addr;
    }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(
        address owner,
        uint256 salt
    ) public view returns (address) {
        return
            Create2.computeAddress(getSalt(owner, salt), _PROXY_BYTECODE_HASH);
    }

    function getSalt(
        address owner,
        uint256 salt
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(owner, salt));
    }
}
