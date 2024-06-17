// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Greeter {
  string internal _greeting;

  constructor(string memory newGreeting) {
    _greeting = newGreeting;
  }

  function setGreeting(string memory newGreeting) public {
    _greeting = newGreeting;
  }

  function greet() public view returns (string memory) {
    return _greeting;
  }
}
