// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/compound/CompTimelock.sol";

contract $CompTimelock is CompTimelock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address admin_, uint256 delay_) CompTimelock(admin_, delay_) payable {
    }

    function $getBlockTimestamp() external view returns (uint256 ret0) {
        (ret0) = super.getBlockTimestamp();
    }
}
