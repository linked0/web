// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {TransactionDelegator} from "../src/TransactionDelegator.sol";
import {MyToken} from "../src/test/MyToken.sol";
import {IERC20Mintable} from "../src/interfaces/IERC20Mintable.sol";
import {Test, console} from "forge-std/Test.sol";

contract TransactionDelegatorTest is Test {
    TransactionDelegator public delegator;
    MyToken public token;

    function setUp() public {
        token = new MyToken();
        delegator = new TransactionDelegator(IERC20Mintable(address(token)));
    }

    function test_Mint() public {
        uint256 balance = token.balanceOf(address(this));
        delegator.mint(address(this), 1);
        assertEq(token.balanceOf(address(this)), balance + 1 ether);
    }
}
