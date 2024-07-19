// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/ShortStrings.sol";
import "../../contracts/utils/StorageSlot.sol";

contract $ShortStrings {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => string) internal $v_string;

    event return$toShortStringWithFallback(ShortString ret0);

    constructor() payable {
    }

    function $toShortString(string calldata str) external pure returns (ShortString ret0) {
        (ret0) = ShortStrings.toShortString(str);
    }

    function $toString(ShortString sstr) external pure returns (string memory ret0) {
        (ret0) = ShortStrings.toString(sstr);
    }

    function $byteLength(ShortString sstr) external pure returns (uint256 ret0) {
        (ret0) = ShortStrings.byteLength(sstr);
    }

    function $toShortStringWithFallback(string calldata value,uint256 store) external payable returns (ShortString ret0) {
        (ret0) = ShortStrings.toShortStringWithFallback(value,$v_string[store]);
        emit return$toShortStringWithFallback(ret0);
    }

    function $toStringWithFallback(ShortString value,uint256 store) external view returns (string memory ret0) {
        (ret0) = ShortStrings.toStringWithFallback(value,$v_string[store]);
    }

    function $byteLengthWithFallback(ShortString value,uint256 store) external view returns (uint256 ret0) {
        (ret0) = ShortStrings.byteLengthWithFallback(value,$v_string[store]);
    }

    receive() external payable {}
}
