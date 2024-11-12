// SPDX-License-Indentifier: MIT
pragma solidity ^0.8.19;

contract Operator {
  uint public value = 1;

  constructor() payable {}

  function add() public {
    value += 1;
  }

  function addTen() public {
    value += 10;
  }

  function getValue() external view returns (uint) {
    return value;
  }
}
