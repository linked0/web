// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ReentrancyTransientMock.sol";
import "../../contracts/utils/ReentrancyGuardTransient.sol";
import "../../contracts/mocks/ReentrancyAttack.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/Context.sol";

contract $ReentrancyTransientMock is ReentrancyTransientMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_reentrancyGuardEntered() external view returns (bool ret0) {
        (ret0) = super._reentrancyGuardEntered();
    }

    receive() external payable {}
}
