// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ERC2771ContextMock.sol";
import "../../contracts/utils/Multicall.sol";
import "../../contracts/metatx/ERC2771Context.sol";
import "../../contracts/mocks/ContextMock.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

contract $ERC2771ContextMock is ERC2771ContextMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address trustedForwarder) ERC2771ContextMock(trustedForwarder) payable {
    }

    function $_msgSender() external view returns (address ret0) {
        (ret0) = super._msgSender();
    }

    function $_msgData() external view returns (bytes memory ret0) {
        (ret0) = super._msgData();
    }

    function $_contextSuffixLength() external view returns (uint256 ret0) {
        (ret0) = super._contextSuffixLength();
    }

    receive() external payable {}
}
