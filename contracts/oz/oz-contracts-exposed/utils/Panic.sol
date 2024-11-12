// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Panic.sol";

contract $Panic {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $GENERIC() external pure returns (uint256) {
        return Panic.GENERIC;
    }

    function $ASSERT() external pure returns (uint256) {
        return Panic.ASSERT;
    }

    function $UNDER_OVERFLOW() external pure returns (uint256) {
        return Panic.UNDER_OVERFLOW;
    }

    function $DIVISION_BY_ZERO() external pure returns (uint256) {
        return Panic.DIVISION_BY_ZERO;
    }

    function $ENUM_CONVERSION_ERROR() external pure returns (uint256) {
        return Panic.ENUM_CONVERSION_ERROR;
    }

    function $STORAGE_ENCODING_ERROR() external pure returns (uint256) {
        return Panic.STORAGE_ENCODING_ERROR;
    }

    function $EMPTY_ARRAY_POP() external pure returns (uint256) {
        return Panic.EMPTY_ARRAY_POP;
    }

    function $ARRAY_OUT_OF_BOUNDS() external pure returns (uint256) {
        return Panic.ARRAY_OUT_OF_BOUNDS;
    }

    function $RESOURCE_ERROR() external pure returns (uint256) {
        return Panic.RESOURCE_ERROR;
    }

    function $INVALID_INTERNAL_FUNCTION() external pure returns (uint256) {
        return Panic.INVALID_INTERNAL_FUNCTION;
    }

    function $panic(uint256 code) external pure {
        Panic.panic(code);
    }

    receive() external payable {}
}
