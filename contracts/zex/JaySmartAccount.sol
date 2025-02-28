// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/UserOperation.sol";
import "./BaseAccount.sol";

/**
  * @title MySmartAccount
  * @dev MySmartAccount contract.
  * This contract provides the specific logic for implementing the IAccount interface - validateUserOp
  */
contract JaySmartAccount is BaseAccount {
    function getSigValidationFailed() public pure returns (uint256) {
        return SIG_VALIDATION_FAILED;
    }

    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData)
    {
        // validate the signature
        // if signature is invalid, return SIG_VALIDATION_FAILED
        // if signature is valid, return 0
        return 0;
    }
}