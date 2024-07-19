// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/structs/MerkleTree.sol";
import "../../../contracts/utils/cryptography/Hashes.sol";
import "../../../contracts/utils/Arrays.sol";
import "../../../contracts/utils/Panic.sol";
import "../../../contracts/utils/SlotDerivation.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/math/SafeCast.sol";

contract $MerkleTree {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => MerkleTree.Bytes32PushTree) internal $v_MerkleTree_Bytes32PushTree;

    event return$setup(bytes32 initialRoot);

    event return$push(uint256 index, bytes32 newRoot);

    constructor() payable {
    }

    function $setup(uint256 self,uint8 levels,bytes32 zero) external payable returns (bytes32 initialRoot) {
        (initialRoot) = MerkleTree.setup($v_MerkleTree_Bytes32PushTree[self],levels,zero);
        emit return$setup(initialRoot);
    }

    function $push(uint256 self,bytes32 leaf) external payable returns (uint256 index, bytes32 newRoot) {
        (index, newRoot) = MerkleTree.push($v_MerkleTree_Bytes32PushTree[self],leaf);
        emit return$push(index, newRoot);
    }

    function $depth(uint256 self) external view returns (uint256 ret0) {
        (ret0) = MerkleTree.depth($v_MerkleTree_Bytes32PushTree[self]);
    }

    receive() external payable {}
}
