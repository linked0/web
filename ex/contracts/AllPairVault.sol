// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Lock.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract AllPairVault {
  uint public unlockTime;
  address payable public owner;
  address public impl;
  Lock public lock;

  event Withdrawal(uint amount, uint when);

  constructor(address _impl) payable {
    impl = _impl;
    owner = payable(msg.sender);
  }

  function createLock(uint id) public {
    lock = Lock(
      Clones.cloneDeterministic(
        impl,
        keccak256(abi.encodePacked(uint256(1), id))
      )
    );
    lock.add();
  }

  function getValue() public view returns (uint) {
    uint val = lock.value();
    console.log("Value is", val);
    return val;
  }
}
