// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AllBasicFriend {
  uint256 public storedValue;
  string public storedMessage;

  function setValues(uint256 value, string memory message) public {
    storedValue = value;
    storedMessage = message;
  }
}
