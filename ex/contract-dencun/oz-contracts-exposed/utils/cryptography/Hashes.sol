// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/cryptography/Hashes.sol";

contract $Hashes {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $commutativeKeccak256(bytes32 a,bytes32 b) external pure returns (bytes32 ret0) {
        (ret0) = Hashes.commutativeKeccak256(a,b);
    }

    receive() external payable {}
}
