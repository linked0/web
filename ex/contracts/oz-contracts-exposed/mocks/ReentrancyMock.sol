// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ReentrancyMock.sol";
import "../../contracts/utils/ReentrancyGuard.sol";
import "../../contracts/mocks/ReentrancyAttack.sol";
import "../../contracts/utils/Context.sol";

contract $ReentrancyMock is ReentrancyMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_reentrancyGuardEntered() external view returns (bool ret0) {
        (ret0) = super._reentrancyGuardEntered();
    }

    receive() external payable {}
}
