// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { TwoStepOwnable } from "../access/TwoStepOwnable.sol";

// prettier-ignore
import { 
    UpgradeBeaconInterface 
} from "../interfaces/UpgradeBeaconInterface.sol";

/**
 * @title   UpgradeBeacon
 * @author  OpenSea Protocol Team
 * @notice  UpgradeBeacon is a ownable contract that is used as a beacon for a
 *          proxy, to retreive it's implementation.
 *
 */
contract UpgradeBeacon is TwoStepOwnable, UpgradeBeaconInterface {
    address private _implementation;

    /**
     * @notice Sets the owner of the beacon as the msg.sender.  Requires
     *         the caller to be an approved deployer.
     *
  
     */
    constructor() {
        // Ensure the origin is an approved deployer.
        require(
            (tx.origin == address(0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E) ||
                tx.origin ==
                address(0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42)),
            "Deployment must originate from an approved deployer."
        );
    }

    /**
     * @notice Upgrades the beacon to a new implementation. Requires
     *         the caller must be the owner, and the new implementation
     *         must be a contract.
     *
     * @param newImplementationAddress The address to be set as the new
     *                                 implementation contract.
     */
    function upgradeTo(address newImplementationAddress)
        external
        override
        onlyOwner
    {
        _setImplementation(newImplementationAddress);
        emit Upgraded(newImplementationAddress);
    }

    function initialize(address owner_, address implementation_) external {
        // Ensure the origin is an approved deployer.
        require(
            (tx.origin == address(0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E) ||
                tx.origin ==
                address(0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42)) &&
                _implementation == address(0),
            "Initialize must originate from an approved deployer, and the implementation must not be set."
        );

        // Call initialize.
        _initialize(owner_, implementation_);
    }

    function _initialize(address owner_, address implementation_) internal {
        // Set the Initial Owner
        _setInitialOwner(owner_);

        // Set the Implementation
        _setImplementation(implementation_);

        // Emit the Event
        emit Upgraded(implementation_);
    }

    /**
     * @notice This function returns the address to the implentation contract.
     */
    function implementation() external view override returns (address) {
        return _implementation;
    }

    /**
     * @notice Sets the implementation contract address for this beacon.
     *         Requires the address to be a contract.
     *
     * @param newImplementationAddress The address to be set as the new
     *                                 implementation contract.
     */
    function _setImplementation(address newImplementationAddress) internal {
        if (address(newImplementationAddress).code.length == 0) {
            revert InvalidImplementation(newImplementationAddress);
        }
        _implementation = newImplementationAddress;
    }
}