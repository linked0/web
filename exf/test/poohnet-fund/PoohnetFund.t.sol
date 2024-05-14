// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PoohnetFund} from "../../src/poohnet-fund/PoohnetFund.sol";
import {Test, console} from "forge-std/Test.sol";

contract PoohnetFundTest is Test {
    PoohnetFund fund;

    address public constant USER = address(1);

    function setUp() external {
        fund = new PoohnetFund();
        vm.deal(address(fund), 1000 ether);
    }

    function testSetOwner() public {
        fund.setOwner(address(this));
        assertEq(fund.owner(), address(this));
    }

    function testTransferBudget() public {
        assertEq(address(fund).balance, 1000 ether);
        fund.transferBudget(address(USER), 100 ether);

        assertEq(address(USER).balance, 100 ether);
    }
}
