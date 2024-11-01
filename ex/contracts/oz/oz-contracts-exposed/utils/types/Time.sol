// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/types/Time.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/math/SafeCast.sol";
import "../../../contracts/utils/Panic.sol";

contract $Time {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $timestamp() external view returns (uint48 ret0) {
        (ret0) = Time.timestamp();
    }

    function $blockNumber() external view returns (uint48 ret0) {
        (ret0) = Time.blockNumber();
    }

    function $toDelay(uint32 duration) external pure returns (Time.Delay ret0) {
        (ret0) = Time.toDelay(duration);
    }

    function $getFull(Time.Delay self) external view returns (uint32 ret0, uint32 ret1, uint48 ret2) {
        (ret0, ret1, ret2) = Time.getFull(self);
    }

    function $get(Time.Delay self) external view returns (uint32 ret0) {
        (ret0) = Time.get(self);
    }

    function $withUpdate(Time.Delay self,uint32 newValue,uint32 minSetback) external view returns (Time.Delay updatedDelay, uint48 effect) {
        (updatedDelay, effect) = Time.withUpdate(self,newValue,minSetback);
    }

    function $unpack(Time.Delay self) external pure returns (uint32 valueBefore, uint32 valueAfter, uint48 effect) {
        (valueBefore, valueAfter, effect) = Time.unpack(self);
    }

    function $pack(uint32 valueBefore,uint32 valueAfter,uint48 effect) external pure returns (Time.Delay ret0) {
        (ret0) = Time.pack(valueBefore,valueAfter,effect);
    }

    receive() external payable {}
}
