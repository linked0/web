// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/DummyImplementation.sol";
import "../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/proxy/beacon/IBeacon.sol";
import "../../contracts/interfaces/IERC1967.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

abstract contract $Impl is Impl {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}

contract $DummyImplementation is DummyImplementation {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}

contract $DummyImplementationV2 is DummyImplementationV2 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
