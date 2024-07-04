// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

uint256 constant Error_selector_offset = 0x1c;

/*
 *  error InvalidMsgValue(uint256 value)
 *    - Defined in ConsiderationEventsAndErrors.sol
 *  Memory layout:
 *    - 0x00: Left-padded selector (data begins at 0x1c)
 *    - 0x20: value
 * Revert buffer is memory[0x1c:0x40]
 */
uint256 constant InvalidMsgValue_error_selector = 0xa61be9f0;
uint256 constant InvalidMsgValue_error_value_ptr = 0x20;
uint256 constant InvalidMsgValue_error_length = 0x24;
