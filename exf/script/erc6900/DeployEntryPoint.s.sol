// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";

contract DeployEntryPoint is Script {
    EntryPoint public entryPoint;

    function run() external returns (EntryPoint) {
        vm.startBroadcast();
        entryPoint = new EntryPoint();
        vm.stopBroadcast();

        return entryPoint;
    }
}