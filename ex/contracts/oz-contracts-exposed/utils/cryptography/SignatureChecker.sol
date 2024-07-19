// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/cryptography/SignatureChecker.sol";
import "../../../contracts/utils/cryptography/ECDSA.sol";
import "../../../contracts/interfaces/IERC1271.sol";

contract $SignatureChecker {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $isValidSignatureNow(address signer,bytes32 hash,bytes calldata signature) external view returns (bool ret0) {
        (ret0) = SignatureChecker.isValidSignatureNow(signer,hash,signature);
    }

    function $isValidERC1271SignatureNow(address signer,bytes32 hash,bytes calldata signature) external view returns (bool ret0) {
        (ret0) = SignatureChecker.isValidERC1271SignatureNow(signer,hash,signature);
    }

    receive() external payable {}
}
