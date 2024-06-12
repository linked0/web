// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract AllBasic {
  uint public value = 1;

  constructor() payable {}

  function add() public {
    console.log("Value in Lock is %o", value);
    value += 1;
    console.log("Value2 in Lock is %o", value);
  }

  function getValue() external view returns (uint) {
    return value;
  }
}
