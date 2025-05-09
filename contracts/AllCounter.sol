// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract AllCounter {
  uint256 public number;

  function setNumber(uint256 newNumber) external {
    number = newNumber;
  }

  function increment() external {
    number++;
  }
}
