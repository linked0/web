// SPDX-Lincese-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {IERC20Mintable} from "../src/interfaces/IERC20Mintable.sol";
import {MyToken} from "../src/test/MyToken.sol";
import {TransactionDelegator} from "../src/TransactionDelegator.sol";

contract DeployTransactionDelegator is Script {
    function run() external returns (TransactionDelegator) {
        vm.startBroadcast();

        MyToken token = new MyToken();
        TransactionDelegator delegator = new TransactionDelegator(
            IERC20Mintable(address(token))
        );

        vm.stopBroadcast();
        return delegator;
    }
}
