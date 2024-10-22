// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC20ExcessDecimalsMock.sol";

contract $ERC20ExcessDecimalsMock is ERC20ExcessDecimalsMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
