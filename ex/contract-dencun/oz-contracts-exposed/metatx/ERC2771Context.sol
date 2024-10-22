// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/metatx/ERC2771Context.sol";
import "../../contracts/utils/Context.sol";

contract $ERC2771Context is ERC2771Context {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address trustedForwarder_) ERC2771Context(trustedForwarder_) payable {
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
