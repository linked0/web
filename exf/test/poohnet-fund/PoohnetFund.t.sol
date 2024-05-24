// SPDX-Lincense-Identifier: MIT

pragma solidity ^0.8.24;

import {PoohnetFund} from "../../src/poohnet-fund/PoohnetFund.sol";
import {console, Test} from "forge-std/Test.sol";

contract PoohnetFundTest is Test {
    PoohnetFund public fund;

    function setUp() public {
        address fundContractAddr = vm.envAddress(
            "POOHNET_FUND_CONTRACT_ADDRESS"
        );
        fund = PoohnetFund(payable(fundContractAddr));
    }

    function test_GetOwner() public view {
        uint deployerKey = vm.envUint("PRIVATE_KEY");
        address owner = fund.getOwner();
        console.log("Owner: ", owner);
        assertEq(fund.getOwner(), vm.addr(deployerKey));
    }
}
