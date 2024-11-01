// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Packing.sol";

contract $Packing {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $asUint128x2(bytes32 self) external pure returns (Packing.Uint128x2 ret0) {
        (ret0) = Packing.asUint128x2(self);
    }

    function $asBytes32(Packing.Uint128x2 self) external pure returns (bytes32 ret0) {
        (ret0) = Packing.asBytes32(self);
    }

    function $pack(uint128 first128,uint128 second128) external pure returns (Packing.Uint128x2 ret0) {
        (ret0) = Packing.pack(first128,second128);
    }

    function $split(Packing.Uint128x2 self) external pure returns (uint128 ret0, uint128 ret1) {
        (ret0, ret1) = Packing.split(self);
    }

    function $first(Packing.Uint128x2 self) external pure returns (uint128 ret0) {
        (ret0) = Packing.first(self);
    }

    function $second(Packing.Uint128x2 self) external pure returns (uint128 ret0) {
        (ret0) = Packing.second(self);
    }

    receive() external payable {}
}
