// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Consideration} from "./Consideration.sol";

contract PoolTerminal is Consideration {
  // A public state variable to store a number
  uint256 public storedValue;

  // An event that is emitted when the stored data is updated
  event DataUpdated(uint256 newData);

  // Constructor to set an initial value
  constructor(uint256 initialValue) {
    storedValue = initialValue;
  }

  // Function to update the stored data
  function set(uint256 newValue) public {
    storedValue = newValue;
    emit DataUpdated(newValue);
  }

  // Function to retrieve the stored data
  function get() public view returns (uint256) {
    return storedValue;
  }
}
