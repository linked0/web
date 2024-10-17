// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/cryptography/MerkleProof.sol";
import "../../../contracts/utils/cryptography/Hashes.sol";

contract $MerkleProof {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $verify(bytes32[] calldata proof,bytes32 root,bytes32 leaf) external pure returns (bool ret0) {
        (ret0) = MerkleProof.verify(proof,root,leaf);
    }

    function $verifyCalldata(bytes32[] calldata proof,bytes32 root,bytes32 leaf) external pure returns (bool ret0) {
        (ret0) = MerkleProof.verifyCalldata(proof,root,leaf);
    }

    function $processProof(bytes32[] calldata proof,bytes32 leaf) external pure returns (bytes32 ret0) {
        (ret0) = MerkleProof.processProof(proof,leaf);
    }

    function $processProofCalldata(bytes32[] calldata proof,bytes32 leaf) external pure returns (bytes32 ret0) {
        (ret0) = MerkleProof.processProofCalldata(proof,leaf);
    }

    function $multiProofVerify(bytes32[] calldata proof,bool[] calldata proofFlags,bytes32 root,bytes32[] calldata leaves) external pure returns (bool ret0) {
        (ret0) = MerkleProof.multiProofVerify(proof,proofFlags,root,leaves);
    }

    function $multiProofVerifyCalldata(bytes32[] calldata proof,bool[] calldata proofFlags,bytes32 root,bytes32[] calldata leaves) external pure returns (bool ret0) {
        (ret0) = MerkleProof.multiProofVerifyCalldata(proof,proofFlags,root,leaves);
    }

    function $processMultiProof(bytes32[] calldata proof,bool[] calldata proofFlags,bytes32[] calldata leaves) external pure returns (bytes32 merkleRoot) {
        (merkleRoot) = MerkleProof.processMultiProof(proof,proofFlags,leaves);
    }

    function $processMultiProofCalldata(bytes32[] calldata proof,bool[] calldata proofFlags,bytes32[] calldata leaves) external pure returns (bytes32 merkleRoot) {
        (merkleRoot) = MerkleProof.processMultiProofCalldata(proof,proofFlags,leaves);
    }

    receive() external payable {}
}
