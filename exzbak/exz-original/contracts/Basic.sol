// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Basic {
  uint public value = 0;
  address payable public owner;

  event Withdrawal(uint amount, uint when);

  constructor() payable {
    owner = payable(msg.sender);
  }

  function add() public returns (uint) {
    console.log(block.timestamp);
    console.log(block.number);
    value += 1;
    return value;
  }
}
