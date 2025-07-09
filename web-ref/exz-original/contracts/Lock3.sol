// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lock3 {
  uint public unlockTime;
  uint public value = 1;
  address payable public owner;

  event Withdrawal(uint amount, uint when);

  constructor(uint _value) payable {
    value = _value;
    owner = payable(msg.sender);
  }

  function add() public {
    value += 1;
  }
}
