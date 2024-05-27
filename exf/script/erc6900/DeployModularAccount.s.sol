// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {IEntryPoint} from "@eth-infinitism/account-abstraction/interfaces/IEntryPoint.sol";
import {UpgradeableModularAccount} from "@erc6900/account/UpgradeableModularAccount.sol";

contract DeployModularAccount is Script {
    function run() external returns (UpgradeableModularAccount) {
        address entryPointAddr = vm.envAddress("ENTRYPOINT_CONTRACT_ADDRESS");
        vm.startBroadcast();
        UpgradeableModularAccount account = new UpgradeableModularAccount(
            IEntryPoint(entryPointAddr)
        );
        vm.stopBroadcast();

        return account;
    }
}
