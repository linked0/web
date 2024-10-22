// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/structs/EnumerableSet.sol";

contract $EnumerableSet {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => EnumerableSet.Bytes32Set) internal $v_EnumerableSet_Bytes32Set;

    mapping(uint256 => EnumerableSet.AddressSet) internal $v_EnumerableSet_AddressSet;

    mapping(uint256 => EnumerableSet.UintSet) internal $v_EnumerableSet_UintSet;

    event return$add_EnumerableSet_Bytes32Set_bytes32(bool ret0);

    event return$remove_EnumerableSet_Bytes32Set_bytes32(bool ret0);

    event return$add_EnumerableSet_AddressSet_address(bool ret0);

    event return$remove_EnumerableSet_AddressSet_address(bool ret0);

    event return$add_EnumerableSet_UintSet_uint256(bool ret0);

    event return$remove_EnumerableSet_UintSet_uint256(bool ret0);

    constructor() payable {
    }

    function $add(uint256 set,bytes32 value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.add($v_EnumerableSet_Bytes32Set[set],value);
        emit return$add_EnumerableSet_Bytes32Set_bytes32(ret0);
    }

    function $remove(uint256 set,bytes32 value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.remove($v_EnumerableSet_Bytes32Set[set],value);
        emit return$remove_EnumerableSet_Bytes32Set_bytes32(ret0);
    }

    function $contains(uint256 set,bytes32 value) external view returns (bool ret0) {
        (ret0) = EnumerableSet.contains($v_EnumerableSet_Bytes32Set[set],value);
    }

    function $length_EnumerableSet_Bytes32Set(uint256 set) external view returns (uint256 ret0) {
        (ret0) = EnumerableSet.length($v_EnumerableSet_Bytes32Set[set]);
    }

    function $at_EnumerableSet_Bytes32Set(uint256 set,uint256 index) external view returns (bytes32 ret0) {
        (ret0) = EnumerableSet.at($v_EnumerableSet_Bytes32Set[set],index);
    }

    function $values_EnumerableSet_Bytes32Set(uint256 set) external view returns (bytes32[] memory ret0) {
        (ret0) = EnumerableSet.values($v_EnumerableSet_Bytes32Set[set]);
    }

    function $add(uint256 set,address value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.add($v_EnumerableSet_AddressSet[set],value);
        emit return$add_EnumerableSet_AddressSet_address(ret0);
    }

    function $remove(uint256 set,address value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.remove($v_EnumerableSet_AddressSet[set],value);
        emit return$remove_EnumerableSet_AddressSet_address(ret0);
    }

    function $contains(uint256 set,address value) external view returns (bool ret0) {
        (ret0) = EnumerableSet.contains($v_EnumerableSet_AddressSet[set],value);
    }

    function $length_EnumerableSet_AddressSet(uint256 set) external view returns (uint256 ret0) {
        (ret0) = EnumerableSet.length($v_EnumerableSet_AddressSet[set]);
    }

    function $at_EnumerableSet_AddressSet(uint256 set,uint256 index) external view returns (address ret0) {
        (ret0) = EnumerableSet.at($v_EnumerableSet_AddressSet[set],index);
    }

    function $values_EnumerableSet_AddressSet(uint256 set) external view returns (address[] memory ret0) {
        (ret0) = EnumerableSet.values($v_EnumerableSet_AddressSet[set]);
    }

    function $add(uint256 set,uint256 value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.add($v_EnumerableSet_UintSet[set],value);
        emit return$add_EnumerableSet_UintSet_uint256(ret0);
    }

    function $remove(uint256 set,uint256 value) external payable returns (bool ret0) {
        (ret0) = EnumerableSet.remove($v_EnumerableSet_UintSet[set],value);
        emit return$remove_EnumerableSet_UintSet_uint256(ret0);
    }

    function $contains(uint256 set,uint256 value) external view returns (bool ret0) {
        (ret0) = EnumerableSet.contains($v_EnumerableSet_UintSet[set],value);
    }

    function $length_EnumerableSet_UintSet(uint256 set) external view returns (uint256 ret0) {
        (ret0) = EnumerableSet.length($v_EnumerableSet_UintSet[set]);
    }

    function $at_EnumerableSet_UintSet(uint256 set,uint256 index) external view returns (uint256 ret0) {
        (ret0) = EnumerableSet.at($v_EnumerableSet_UintSet[set],index);
    }

    function $values_EnumerableSet_UintSet(uint256 set) external view returns (uint256[] memory ret0) {
        (ret0) = EnumerableSet.values($v_EnumerableSet_UintSet[set]);
    }

    receive() external payable {}
}
