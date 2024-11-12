// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Base64.sol";

contract $Base64 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_TABLE() external pure returns (string memory) {
        return Base64._TABLE;
    }

    function $_TABLE_URL() external pure returns (string memory) {
        return Base64._TABLE_URL;
    }

    function $encode(bytes calldata data) external pure returns (string memory ret0) {
        (ret0) = Base64.encode(data);
    }

    function $encodeURL(bytes calldata data) external pure returns (string memory ret0) {
        (ret0) = Base64.encodeURL(data);
    }

    receive() external payable {}
}
