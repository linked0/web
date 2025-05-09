// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "hardhat/console.sol";

import {Error_selector_offset, InvalidMsgValue_error_selector, InvalidMsgValue_error_value_ptr, InvalidMsgValue_error_length} from "./AllBasicErrorConstants.sol";

/**
 * @dev Reverts the current transaction with an "InvalidMsgValue" error message,
 *      including the invalid value that was sent in the transaction's
 *      `msg.value` field.
 *
 * @param value The invalid value that was sent in the transaction's `msg.value`
 *              field.
 */
function _revertInvalidMsgValue(uint256 value) pure {
  // console.log("value: ", value);
  assembly {
    // Store left-padded selector with push4 (reduces bytecode),
    // mem[28:32] = selector
    mstore(0, InvalidMsgValue_error_selector)

    // Store argument.
    mstore(InvalidMsgValue_error_value_ptr, value)

    // revert(abi.encodeWithSignature("InvalidMsgValue(uint256)", value))
    revert(Error_selector_offset, InvalidMsgValue_error_length)
  }
}
