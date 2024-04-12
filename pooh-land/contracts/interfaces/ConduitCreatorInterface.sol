// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import {
    ConduitControllerInterface
} from "../interfaces/ConduitControllerInterface.sol";

/**
 * @title ConduitCreatorInterface
 * @author 0age
 * @notice ConduitCreatorInterface contains function endpoints and an error
 *         declaration for the ConduitCreator contract.
 */
interface ConduitCreatorInterface {
    // Declare custom error for an invalid conduit creator.
    error InvalidConduitCreator();

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
    ) external returns (address conduit);

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
    ) external;

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
    ) external;

    /**
     * @notice Get the creator address of conduit
     *
     * @return creator the address of conduit creator
     */
    function getConduitCreator() external returns (address creator);
}
