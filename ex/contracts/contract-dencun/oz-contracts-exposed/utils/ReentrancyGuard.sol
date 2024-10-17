// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/ReentrancyGuard.sol";

contract $ReentrancyGuard is ReentrancyGuard {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_reentrancyGuardEntered() external view returns (bool ret0) {
        (ret0) = super._reentrancyGuardEntered();
    }

    receive() external payable {}
}
