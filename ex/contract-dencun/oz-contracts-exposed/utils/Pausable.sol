// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Pausable.sol";
import "../../contracts/utils/Context.sol";

contract $Pausable is Pausable {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_requireNotPaused() external view {
        super._requireNotPaused();
    }

    function $_requirePaused() external view {
        super._requirePaused();
    }

    function $_pause() external {
        super._pause();
    }

    function $_unpause() external {
        super._unpause();
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
