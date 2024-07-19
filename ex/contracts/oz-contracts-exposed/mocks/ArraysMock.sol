// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ArraysMock.sol";
import "../../contracts/utils/Arrays.sol";
import "../../contracts/utils/SlotDerivation.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $Uint256ArraysMock is Uint256ArraysMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(uint256[] memory array) Uint256ArraysMock(array) payable {
    }

    receive() external payable {}
}

contract $AddressArraysMock is AddressArraysMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address[] memory array) AddressArraysMock(array) payable {
    }

    receive() external payable {}
}

contract $Bytes32ArraysMock is Bytes32ArraysMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(bytes32[] memory array) Bytes32ArraysMock(array) payable {
    }

    receive() external payable {}
}
