// SPDX_License-Identifier: MIT
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract Vault {
  uint public unlockTime;
  address payable public owner;

  event Deposit(uint amount, uint when);
  event Withdraw(uint amount, uint when);

  constructor(uint _unlockTime) {
    // require(_unlockTime > block.timestamp,
    //   "Unlock time must be in the future");
    unlockTime = _unlockTime;
    owner = payable(0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42);
  }
  
  function deposit() public payable {
    emit Deposit(msg.value, block.timestamp);
  }

  function withdraw() public {
    require(block.timestamp >= unlockTime,
      "You cannot withdraw before the unlock time");
    require(msg.sender == owner,
      "You are not the owner"); 

    emit Withdraw(address(this).balance, block.timestamp);
    owner.transfer(address(this).balance);
  }
}