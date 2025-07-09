// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

/**
 * @title UnrestrictedOwner
 * @author JohnnyTime (https://smartcontractshacking.com)
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

