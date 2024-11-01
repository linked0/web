// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC1155ReceiverMock.sol";
import "../../../contracts/token/ERC1155/IERC1155Receiver.sol";
import "../../../contracts/utils/introspection/ERC165.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC1155ReceiverMock is ERC1155ReceiverMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(bytes4 recRetval, bytes4 batRetval, RevertType error) ERC1155ReceiverMock(recRetval, batRetval, error) payable {
    }

    receive() external payable {}
}
