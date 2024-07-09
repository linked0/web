// SPDX-Lincese-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title UnrestrictedOwner
 * @author Jay Lee (https://github.com/linked0)
 */

contract UnrestrictedOwner {
  address public owner;

  constructor() {
    owner = msg.sender;
  }

  function changeOwner(address _newOwner) public {
    owner = _newOwner;
  }
}
