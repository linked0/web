// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC1363ReceiverMock.sol";
import "../../../contracts/interfaces/IERC1363Receiver.sol";

contract $ERC1363ReceiverMock is ERC1363ReceiverMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
