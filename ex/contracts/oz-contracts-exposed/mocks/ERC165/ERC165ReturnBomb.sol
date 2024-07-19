// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/ERC165/ERC165ReturnBomb.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC165ReturnBombMock is ERC165ReturnBombMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
