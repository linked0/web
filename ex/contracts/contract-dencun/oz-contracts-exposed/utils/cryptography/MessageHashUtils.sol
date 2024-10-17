// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/cryptography/MessageHashUtils.sol";
import "../../../contracts/utils/Strings.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/math/SignedMath.sol";
import "../../../contracts/utils/Panic.sol";
import "../../../contracts/utils/math/SafeCast.sol";

contract $MessageHashUtils {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $toEthSignedMessageHash(bytes32 messageHash) external pure returns (bytes32 digest) {
        (digest) = MessageHashUtils.toEthSignedMessageHash(messageHash);
    }

    function $toEthSignedMessageHash(bytes calldata message) external pure returns (bytes32 ret0) {
        (ret0) = MessageHashUtils.toEthSignedMessageHash(message);
    }

    function $toDataWithIntendedValidatorHash(address validator,bytes calldata data) external pure returns (bytes32 ret0) {
        (ret0) = MessageHashUtils.toDataWithIntendedValidatorHash(validator,data);
    }

    function $toTypedDataHash(bytes32 domainSeparator,bytes32 structHash) external pure returns (bytes32 digest) {
        (digest) = MessageHashUtils.toTypedDataHash(domainSeparator,structHash);
    }

    receive() external payable {}
}
