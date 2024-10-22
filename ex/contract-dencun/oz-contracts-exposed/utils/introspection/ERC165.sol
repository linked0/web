// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/introspection/ERC165.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC165 is ERC165 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
