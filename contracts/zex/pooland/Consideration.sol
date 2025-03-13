// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {BasicOrderParameters, BasicOrderType} from "./ConsiderationStructs.sol";

contract Consideration {
  // A public state variable to store some data
  string[] public storedData;

  // Event to log basic order fulfillment including the basicOrderType.
  event BasicOrderFulfilled(
    address indexed caller,
    bool fulfilled,
    BasicOrderType basicOrderType
  );

  /**
   * @notice Accept native token transfers during execution that may then be
   *         used to facilitate native token transfers, where any tokens that
   *         remain will be transferred to the caller. Native tokens are only
   *         acceptable mid-fulfillment (and not during basic fulfillment).
   */
  receive() external payable {
    // Ensure the reentrancy guard is currently set to accept native tokens.
    _assertAcceptingNativeTokens();
  }

  /**
   * @notice Fulfills a basic order.
   * @param params Basic order parameters (defined in ConsiderationStructs.sol)
   * @return fulfilled A boolean value indicating if the order was fulfilled.
   */
  function fulfillBasicOrder(
    BasicOrderParameters calldata params
  ) external payable returns (bool fulfilled) {
    // (Insert any order fulfillment logic here)

    // For demonstration, we simply assume the order is fulfilled.
    fulfilled = true;

    // Emit an event indicating that the basic order was fulfilled.
    emit BasicOrderFulfilled(msg.sender, fulfilled, params.basicOrderType);

    return fulfilled;
  }

  function _assertAcceptingNativeTokens() internal view {
    // Implementation logic for asserting native token acceptance.
  }
}
