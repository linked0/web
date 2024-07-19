// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/SlotDerivation.sol";

contract $SlotDerivation {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $erc7201Slot(string calldata namespace) external pure returns (bytes32 slot) {
        (slot) = SlotDerivation.erc7201Slot(namespace);
    }

    function $offset(bytes32 slot,uint256 pos) external pure returns (bytes32 result) {
        (result) = SlotDerivation.offset(slot,pos);
    }

    function $deriveArray(bytes32 slot) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveArray(slot);
    }

    function $deriveMapping(bytes32 slot,address key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,bool key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,bytes32 key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,uint256 key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,int256 key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,string calldata key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    function $deriveMapping(bytes32 slot,bytes calldata key) external pure returns (bytes32 result) {
        (result) = SlotDerivation.deriveMapping(slot,key);
    }

    receive() external payable {}
}
