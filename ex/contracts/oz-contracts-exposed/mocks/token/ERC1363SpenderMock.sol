// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC1363SpenderMock.sol";
import "../../../contracts/interfaces/IERC1363Spender.sol";

contract $ERC1363SpenderMock is ERC1363SpenderMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
