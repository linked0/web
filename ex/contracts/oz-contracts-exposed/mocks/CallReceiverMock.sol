// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/CallReceiverMock.sol";

contract $CallReceiverMock is CallReceiverMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}

contract $CallReceiverMockTrustingForwarder is CallReceiverMockTrustingForwarder {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address trustedForwarder_) CallReceiverMockTrustingForwarder(trustedForwarder_) payable {
    }

    receive() external payable {}
}
