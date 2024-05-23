// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {PoohnetFund} from "../../src/poohnet-fund/PoohnetFund.sol";
import {Script, console} from "forge-std/Script.sol";

contract BalanceFundScript is Script {
    function run() external view {
        address fundContractAddr = vm.envAddress("POOHNET_FUND_CONTRACT_ADDRESS");
        PoohnetFund fundContract = PoohnetFund(payable(fundContractAddr));

        // print the balance of the fund contract
        console.log("Fund balance:", fundContractAddr.balance);
        console.log("Fund contract chainid:", fundContract.getChainId());
    }
}
