// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/structs/BitMaps.sol";

contract $BitMaps {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => BitMaps.BitMap) internal $v_BitMaps_BitMap;

    constructor() payable {
    }

    function $get(uint256 bitmap,uint256 index) external view returns (bool ret0) {
        (ret0) = BitMaps.get($v_BitMaps_BitMap[bitmap],index);
    }

    function $setTo(uint256 bitmap,uint256 index,bool value) external payable {
        BitMaps.setTo($v_BitMaps_BitMap[bitmap],index,value);
    }

    function $set(uint256 bitmap,uint256 index) external payable {
        BitMaps.set($v_BitMaps_BitMap[bitmap],index);
    }

    function $unset(uint256 bitmap,uint256 index) external payable {
        BitMaps.unset($v_BitMaps_BitMap[bitmap],index);
    }

    receive() external payable {}
}
