// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Strings.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/math/SignedMath.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $Strings {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $toString(uint256 value) external pure returns (string memory ret0) {
        (ret0) = Strings.toString(value);
    }

    function $toStringSigned(int256 value) external pure returns (string memory ret0) {
        (ret0) = Strings.toStringSigned(value);
    }

    function $toHexString(uint256 value) external pure returns (string memory ret0) {
        (ret0) = Strings.toHexString(value);
    }

    function $toHexString(uint256 value,uint256 length) external pure returns (string memory ret0) {
        (ret0) = Strings.toHexString(value,length);
    }

    function $toHexString(address addr) external pure returns (string memory ret0) {
        (ret0) = Strings.toHexString(addr);
    }

    function $equal(string calldata a,string calldata b) external pure returns (bool ret0) {
        (ret0) = Strings.equal(a,b);
    }

    receive() external payable {}
}
