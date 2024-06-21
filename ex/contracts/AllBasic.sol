// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";

// @audit-issue Should emit event
contract AllBasic {
  uint public value = 1;
  mapping(address => bool) public approvals;
  mapping(address => bool) public spenders;

  constructor() payable {}

  function add() public {
    console.log("Value in Lock is %o", value);
    value += 1;
    console.log("Value2 in Lock is %o", value);
  }

  function getValue() external view returns (uint) {
    return value;
  }

  function approve(address owner, address spender) public {
    approvals[owner] = true;
    spenders[spender] = true;
  }
}
