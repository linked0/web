// SPDX-Lincense-Identifier: MIT

pragma solidity ^0.8.24;

import {PoohnetFund} from "../../src/poohnet-fund/PoohnetFund.sol";
import {Test} from "forge-std/Test.sol";

contract PoohnetFundTest is Test {
    PoohnetFund public fund;

    function setUp() public {
        fund = new PoohnetFund();
    }

    function test_GetOwner() public view {
        assertEq(fund.getOwner(), address(this));
    }
}
