// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/math/SignedMath.sol";

contract $SignedMath {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $max(int256 a,int256 b) external pure returns (int256 ret0) {
        (ret0) = SignedMath.max(a,b);
    }

    function $min(int256 a,int256 b) external pure returns (int256 ret0) {
        (ret0) = SignedMath.min(a,b);
    }

    function $average(int256 a,int256 b) external pure returns (int256 ret0) {
        (ret0) = SignedMath.average(a,b);
    }

    function $abs(int256 n) external pure returns (uint256 ret0) {
        (ret0) = SignedMath.abs(n);
    }

    receive() external payable {}
}
