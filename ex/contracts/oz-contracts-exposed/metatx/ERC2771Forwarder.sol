// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/metatx/ERC2771Forwarder.sol";
import "../../contracts/utils/Nonces.sol";
import "../../contracts/utils/cryptography/EIP712.sol";
import "../../contracts/interfaces/IERC5267.sol";
import "../../contracts/metatx/ERC2771Context.sol";
import "../../contracts/utils/cryptography/ECDSA.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";
import "../../contracts/utils/cryptography/MessageHashUtils.sol";
import "../../contracts/utils/ShortStrings.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/utils/Strings.sol";
import "../../contracts/utils/StorageSlot.sol";
import "../../contracts/utils/math/Math.sol";
import "../../contracts/utils/math/SignedMath.sol";
import "../../contracts/utils/Panic.sol";
import "../../contracts/utils/math/SafeCast.sol";

contract $ERC2771Forwarder is ERC2771Forwarder {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_execute(bool success);

    event return$_useNonce(uint256 ret0);

    constructor(string memory name) ERC2771Forwarder(name) payable {
    }

    function $_FORWARD_REQUEST_TYPEHASH() external pure returns (bytes32) {
        return _FORWARD_REQUEST_TYPEHASH;
    }

    function $_validate(ForwardRequestData calldata request) external view returns (bool isTrustedForwarder, bool active, bool signerMatch, address signer) {
        (isTrustedForwarder, active, signerMatch, signer) = super._validate(request);
    }

    function $_recoverForwardRequestSigner(ForwardRequestData calldata request) external view returns (bool ret0, address ret1) {
        (ret0, ret1) = super._recoverForwardRequestSigner(request);
    }

    function $_execute(ForwardRequestData calldata request,bool requireValidRequest) external returns (bool success) {
        (success) = super._execute(request,requireValidRequest);
        emit return$_execute(success);
    }

    function $_useNonce(address owner) external returns (uint256 ret0) {
        (ret0) = super._useNonce(owner);
        emit return$_useNonce(ret0);
    }

    function $_useCheckedNonce(address owner,uint256 nonce) external {
        super._useCheckedNonce(owner,nonce);
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
