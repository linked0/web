// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC721ReceiverMock.sol";
import "../../../contracts/token/ERC721/IERC721Receiver.sol";

contract $ERC721ReceiverMock is ERC721ReceiverMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(bytes4 retval, RevertType error) ERC721ReceiverMock(retval, error) payable {
    }

    receive() external payable {}
}
