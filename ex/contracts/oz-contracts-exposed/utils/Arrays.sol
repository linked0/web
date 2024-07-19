// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Arrays.sol";
import "../../contracts/utils/SlotDerivation.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $Arrays {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => uint256[]) internal $v_uint256_;

    mapping(uint256 => address[]) internal $v_address_;

    mapping(uint256 => bytes32[]) internal $v_bytes32_;

    constructor() payable {
    }

    function $sort(bytes32[] calldata array) external pure returns (bytes32[] memory ret0) {
        (ret0) = Arrays.sort(array);
    }

    function $sort(address[] calldata array) external pure returns (address[] memory ret0) {
        (ret0) = Arrays.sort(array);
    }

    function $sort(uint256[] calldata array) external pure returns (uint256[] memory ret0) {
        (ret0) = Arrays.sort(array);
    }

    function $findUpperBound(uint256 array,uint256 element) external view returns (uint256 ret0) {
        (ret0) = Arrays.findUpperBound($v_uint256_[array],element);
    }

    function $lowerBound(uint256 array,uint256 element) external view returns (uint256 ret0) {
        (ret0) = Arrays.lowerBound($v_uint256_[array],element);
    }

    function $upperBound(uint256 array,uint256 element) external view returns (uint256 ret0) {
        (ret0) = Arrays.upperBound($v_uint256_[array],element);
    }

    function $lowerBoundMemory(uint256[] calldata array,uint256 element) external pure returns (uint256 ret0) {
        (ret0) = Arrays.lowerBoundMemory(array,element);
    }

    function $upperBoundMemory(uint256[] calldata array,uint256 element) external pure returns (uint256 ret0) {
        (ret0) = Arrays.upperBoundMemory(array,element);
    }

    function $unsafeAccess_address_(uint256 arr,uint256 pos) external view returns (StorageSlot.AddressSlot memory ret0) {
        (ret0) = Arrays.unsafeAccess($v_address_[arr],pos);
    }

    function $unsafeAccess_bytes32_(uint256 arr,uint256 pos) external view returns (StorageSlot.Bytes32Slot memory ret0) {
        (ret0) = Arrays.unsafeAccess($v_bytes32_[arr],pos);
    }

    function $unsafeAccess_uint256_(uint256 arr,uint256 pos) external view returns (StorageSlot.Uint256Slot memory ret0) {
        (ret0) = Arrays.unsafeAccess($v_uint256_[arr],pos);
    }

    function $unsafeMemoryAccess(address[] calldata arr,uint256 pos) external pure returns (address res) {
        (res) = Arrays.unsafeMemoryAccess(arr,pos);
    }

    function $unsafeMemoryAccess(bytes32[] calldata arr,uint256 pos) external pure returns (bytes32 res) {
        (res) = Arrays.unsafeMemoryAccess(arr,pos);
    }

    function $unsafeMemoryAccess(uint256[] calldata arr,uint256 pos) external pure returns (uint256 res) {
        (res) = Arrays.unsafeMemoryAccess(arr,pos);
    }

    function $unsafeSetLength_address_(uint256 array,uint256 len) external payable {
        Arrays.unsafeSetLength($v_address_[array],len);
    }

    function $unsafeSetLength_bytes32_(uint256 array,uint256 len) external payable {
        Arrays.unsafeSetLength($v_bytes32_[array],len);
    }

    function $unsafeSetLength_uint256_(uint256 array,uint256 len) external payable {
        Arrays.unsafeSetLength($v_uint256_[array],len);
    }

    receive() external payable {}
}
