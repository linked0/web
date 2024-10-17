// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/MerkleTreeMock.sol";
import "../../contracts/utils/structs/MerkleTree.sol";
import "../../contracts/utils/cryptography/Hashes.sol";
import "../../contracts/utils/Arrays.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/SlotDerivation.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $MerkleTreeMock is MerkleTreeMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
