// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/StorageSlot.sol";

contract $StorageSlot {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => string) internal $v_string;

    mapping(uint256 => bytes) internal $v_bytes;

    constructor() payable {
    }

    function $getAddressSlot(bytes32 slot) external pure returns (StorageSlot.AddressSlot memory r) {
        (r) = StorageSlot.getAddressSlot(slot);
    }

    function $getBooleanSlot(bytes32 slot) external pure returns (StorageSlot.BooleanSlot memory r) {
        (r) = StorageSlot.getBooleanSlot(slot);
    }

    function $getBytes32Slot(bytes32 slot) external pure returns (StorageSlot.Bytes32Slot memory r) {
        (r) = StorageSlot.getBytes32Slot(slot);
    }

    function $getUint256Slot(bytes32 slot) external pure returns (StorageSlot.Uint256Slot memory r) {
        (r) = StorageSlot.getUint256Slot(slot);
    }

    function $getInt256Slot(bytes32 slot) external pure returns (StorageSlot.Int256Slot memory r) {
        (r) = StorageSlot.getInt256Slot(slot);
    }

    function $getStringSlot(bytes32 slot) external pure returns (StorageSlot.StringSlot memory r) {
        (r) = StorageSlot.getStringSlot(slot);
    }

    function $getStringSlot(uint256 store) external view returns (StorageSlot.StringSlot memory r) {
        (r) = StorageSlot.getStringSlot($v_string[store]);
    }

    function $getBytesSlot(bytes32 slot) external pure returns (StorageSlot.BytesSlot memory r) {
        (r) = StorageSlot.getBytesSlot(slot);
    }

    function $getBytesSlot(uint256 store) external view returns (StorageSlot.BytesSlot memory r) {
        (r) = StorageSlot.getBytesSlot($v_bytes[store]);
    }

    function $asAddress(bytes32 slot) external pure returns (StorageSlot.AddressSlotType ret0) {
        (ret0) = StorageSlot.asAddress(slot);
    }

    function $asBoolean(bytes32 slot) external pure returns (StorageSlot.BooleanSlotType ret0) {
        (ret0) = StorageSlot.asBoolean(slot);
    }

    function $asBytes32(bytes32 slot) external pure returns (StorageSlot.Bytes32SlotType ret0) {
        (ret0) = StorageSlot.asBytes32(slot);
    }

    function $asUint256(bytes32 slot) external pure returns (StorageSlot.Uint256SlotType ret0) {
        (ret0) = StorageSlot.asUint256(slot);
    }

    function $asInt256(bytes32 slot) external pure returns (StorageSlot.Int256SlotType ret0) {
        (ret0) = StorageSlot.asInt256(slot);
    }

    function $tload_StorageSlot_AddressSlotType(StorageSlot.AddressSlotType slot) external view returns (address value) {
        (value) = StorageSlot.tload(slot);
    }

    function $tstore(StorageSlot.AddressSlotType slot,address value) external payable {
        StorageSlot.tstore(slot,value);
    }

    function $tload_StorageSlot_BooleanSlotType(StorageSlot.BooleanSlotType slot) external view returns (bool value) {
        (value) = StorageSlot.tload(slot);
    }

    function $tstore(StorageSlot.BooleanSlotType slot,bool value) external payable {
        StorageSlot.tstore(slot,value);
    }

    function $tload_StorageSlot_Bytes32SlotType(StorageSlot.Bytes32SlotType slot) external view returns (bytes32 value) {
        (value) = StorageSlot.tload(slot);
    }

    function $tstore(StorageSlot.Bytes32SlotType slot,bytes32 value) external payable {
        StorageSlot.tstore(slot,value);
    }

    function $tload_StorageSlot_Uint256SlotType(StorageSlot.Uint256SlotType slot) external view returns (uint256 value) {
        (value) = StorageSlot.tload(slot);
    }

    function $tstore(StorageSlot.Uint256SlotType slot,uint256 value) external payable {
        StorageSlot.tstore(slot,value);
    }

    function $tload_StorageSlot_Int256SlotType(StorageSlot.Int256SlotType slot) external view returns (int256 value) {
        (value) = StorageSlot.tload(slot);
    }

    function $tstore(StorageSlot.Int256SlotType slot,int256 value) external payable {
        StorageSlot.tstore(slot,value);
    }

    receive() external payable {}
}
