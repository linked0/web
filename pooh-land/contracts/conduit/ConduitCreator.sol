// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import {
    ConduitCreatorInterface
} from "../interfaces/ConduitCreatorInterface.sol";

import {
    ConduitControllerInterface
} from "../interfaces/ConduitControllerInterface.sol";

/**
 * @title ConduitCreator
 * @author 0age
 * @notice ConduitCreator allows a specific account to create new conduits on
           arbitrary conduit controllers.
 */
contract ConduitCreator is ConduitCreatorInterface {
    // Set the conduit creator as an immutable argument.
    address internal immutable _CONDUIT_CREATOR;

    /**
     * @notice Modifier to ensure that only the conduit creator can call a given
     *         function.
     */
    modifier onlyCreator() {
        // Ensure that the caller is the conduit creator.
        if (msg.sender != _CONDUIT_CREATOR) {
            revert InvalidConduitCreator();
        }

        // Proceed with function execution.
        _;
    }

    /**
     * @dev Initialize contract by setting the conduit creator.
     */
    constructor(address conduitCreator) {
        // Set the conduit creator as an immutable argument.
        _CONDUIT_CREATOR = conduitCreator;
    }

    /**
     * @notice Deploy a new conduit on a given conduit controller using a
     *         supplied conduit key and assigning an initial owner for the
     *         deployed conduit. Only callable by the conduit creator.
     *
     * @param conduitController The conduit controller used to deploy the
     *                          conduit.
     * @param conduitKey        The conduit key used to deploy the
     *                          conduit.
     * @param initialOwner      The initial owner to set for the new
     *                          conduit.
     *
     * @return conduit The address of the newly deployed conduit.
     */
    function createConduit(
        ConduitControllerInterface conduitController,
        bytes32 conduitKey,
        address initialOwner
    ) external override onlyCreator returns (address conduit) {
        // Call the conduit controller to create the conduit.
        conduit = conduitController.createConduit(conduitKey, initialOwner);
    }

    /**
     * @notice Initiate conduit ownership transfer by assigning a new potential
     *         owner for the given conduit. Only callable by the conduit
     *         creator.
     *
     * @param conduitController The conduit controller used to deploy the
     *                          conduit.
     * @param conduit           The conduit for which to initiate ownership
     *                          transfer.
     */
    function transferOwnership(
        ConduitControllerInterface conduitController,
        address conduit,
        address newPotentialOwner
    ) external override onlyCreator {
        // Call the conduit controller to transfer conduit ownership.
        conduitController.transferOwnership(conduit, newPotentialOwner);
    }

    /**
     * @notice Clear the currently set potential owner, if any, from a conduit.
     *         Only callable by the conduit creator.
     *
     * @param conduitController The conduit controller used to deploy the
     *                          conduit.
     * @param conduit           The conduit for which to cancel ownership
     *                          transfer.
     */
    function cancelOwnershipTransfer(
        ConduitControllerInterface conduitController,
        address conduit
    ) external override onlyCreator {
        // Call the conduit controller to cancel ownership transfer.
        conduitController.cancelOwnershipTransfer(conduit);
    }

    /**
     * @notice Get the creator address of conduit
     *
     * @return creator the address of conduit creator
     */
    function getConduitCreator() external override view returns (address creator) {
        return _CONDUIT_CREATOR;
    }
}
