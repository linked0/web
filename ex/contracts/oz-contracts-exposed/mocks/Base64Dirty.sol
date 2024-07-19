// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/Base64Dirty.sol";
import "../../contracts/utils/Base64.sol";

contract $Base64Dirty is Base64Dirty {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
