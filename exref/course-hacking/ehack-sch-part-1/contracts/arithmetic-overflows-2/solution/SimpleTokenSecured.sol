// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

/**
 * @title SimpleTokenSecured
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract SimpleTokenSecured {

  address public minter;
  mapping(address => uint) public getBalance;
  uint public totalSupply;

  constructor() public {
    minter = msg.sender;
  }

  function mint(address _to, uint _amount) external {
    require(msg.sender == minter, "not minter");
    getBalance[_to] += _amount;
  }

  function transfer(address _to, uint _value) public returns (bool) {
    require(getBalance[msg.sender] - _value >= 0);
    getBalance[msg.sender] -= _value;
    getBalance[_to] += _value;
    return true;
  }
  
}