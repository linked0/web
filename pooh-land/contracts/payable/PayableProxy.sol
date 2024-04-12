// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { PayableProxyInterface } from "../interfaces/PayableProxyInterface.sol";

interface IUpgradeBeacon {
    /**
     * @notice An external view function that returns the implementation.
     *
     * @return The address of the implementation.
     */
    function implementation() external view returns (address);
}

/**
 * @title   PayableProxy
 * @author  OpenSea Protocol Team
 * @notice  PayableProxy is a beacon proxy which will immediately return if
 *          called with callvalue. Otherwise, it will delegatecall the beacon
 *          implementation.
 */
contract PayableProxy is PayableProxyInterface {
    // Address of the beacon.
    address private immutable _beacon;

    constructor(address beacon) payable {
        // Ensure the origin is an approved deployer.
        require(
            (tx.origin == address(0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E) ||
                tx.origin ==
                address(0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42)),
            "Deployment must originate from an approved deployer."
        );
        // Set the initial beacon.
        _beacon = beacon;
    }

    function initialize(address ownerToSet) external {
        // Ensure the origin is an approved deployer.
        require(
            (tx.origin == address(0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E) ||
                tx.origin ==
                address(0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42)),
            "Initialize must originate from an approved deployer."
        );
        // Get the implementation address from the provided beacon.
        address implementation = IUpgradeBeacon(_beacon).implementation();

        // Create the initializationCalldata from the provided parameters.
        bytes memory initializationCalldata = abi.encodeWithSignature(
            "initialize(address)",
            ownerToSet
        );

        // Delegatecall into the implementation, supplying initialization
        // calldata.
        (bool ok, ) = implementation.delegatecall(initializationCalldata);

        // Revert and include revert data if delegatecall to implementation
        // reverts.
        if (!ok) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }

    /**
     * @dev Fallback function that delegates calls to the address returned by
     *      `_implementation()`. Will run if no other function in the contract
     *      matches the call data.
     */
    fallback() external payable override {
        _fallback();
    }

    /**
     * @dev Internal fallback function that delegates calls to the address
     *      returned by `_implementation()`. Will run if no other function
     *      in the contract matches the call data.
     */
    function _fallback() internal {
        // Delegate if call value is zero.
        if (msg.value == 0) {
            _delegate(_implementation());
        }
    }

    /**
     * @dev Delegates the current call to `implementation`.
     *
     * This function does not return to its internal call site, it will
     * return directly to the external caller.
     */
    function _delegate(address implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this
            // inline assembly block because it will not return to
            // Solidity code. We overwrite the Solidity scratch pad
            // at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /**
     * @dev This function returns the address to which the fallback function
     *      should delegate.
     */
    function _implementation() internal view returns (address) {
        return IUpgradeBeacon(_beacon).implementation();
    }
}