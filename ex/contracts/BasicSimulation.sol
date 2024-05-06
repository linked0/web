// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BasicSimulation {
  uint public value = 0;
  address payable public owner;

  event Withdrawal(uint amount, uint when);

  constructor() payable {
    owner = payable(msg.sender);
  }

  function add() public returns (uint) {
    value += 99;
    return value;
  }
}
