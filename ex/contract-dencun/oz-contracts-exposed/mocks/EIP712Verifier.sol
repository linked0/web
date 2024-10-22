// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/EIP712Verifier.sol";
import "../../contracts/utils/cryptography/EIP712.sol";
import "../../contracts/interfaces/IERC5267.sol";
import "../../contracts/utils/cryptography/ECDSA.sol";
import "../../contracts/utils/cryptography/MessageHashUtils.sol";
import "../../contracts/utils/ShortStrings.sol";
import "../../contracts/utils/Strings.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/math/SignedMath.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $EIP712Verifier is EIP712Verifier {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(string memory name, string memory version) EIP712(name, version) payable {
    }

    function $_domainSeparatorV4() external view returns (bytes32 ret0) {
        (ret0) = super._domainSeparatorV4();
    }

    function $_hashTypedDataV4(bytes32 structHash) external view returns (bytes32 ret0) {
        (ret0) = super._hashTypedDataV4(structHash);
    }

    function $_EIP712Name() external view returns (string memory ret0) {
        (ret0) = super._EIP712Name();
    }

    function $_EIP712Version() external view returns (string memory ret0) {
        (ret0) = super._EIP712Version();
    }

    receive() external payable {}
}
