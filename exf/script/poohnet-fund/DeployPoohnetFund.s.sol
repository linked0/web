// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {PoohnetFund} from "../../src/poohnet-fund/PoohnetFund.sol";
import {Script, console} from "forge-std/Script.sol";

contract PoohnetFundScript is Script {
    function run() external returns (PoohnetFund) {
        vm.startBroadcast();
        PoohnetFund fund = new PoohnetFund();
        vm.stopBroadcast();
        return fund;
    }
}
