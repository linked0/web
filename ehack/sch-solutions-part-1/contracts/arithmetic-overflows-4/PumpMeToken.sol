// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.7.0;

library SafeMath {

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

/**
 * @title PumpMeToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract PumpMeToken {

  using SafeMath for uint;
  
  mapping(address => uint) balances;
  uint public totalSupply;
  address public manager;

  constructor(uint _initialSupply) {
    manager = msg.sender;
    balances[msg.sender] = totalSupply = _initialSupply;
  }

  modifier onlyManager {
    require(msg.sender == manager, "only manager function!");
    _;
  }

  function mint(address to, uint amount) external onlyManager {
    balances[to] = balances[to].add(amount);
    totalSupply = totalSupply.add(amount);
  }

  function transfer(address _to, uint _value) external returns (bool) {
    require(balances[msg.sender] >= _value, "Not enough balance");
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    return true;
  }

  function batchTransfer(address[] memory _receivers, uint _value) external returns (bool) {
    
    // _receivers = [attacker.address, deployer.address]
    // _value = 5.789604461865814e76
    // totalAmount = 0
    uint totalAmount = _receivers.length * _value;
    require(_value > 0, "Value can't be 0" );
    require(balances[msg.sender] >= totalAmount, "Not enough tokens");

    balances[msg.sender] = balances[msg.sender].sub(totalAmount);

    for(uint i = 0; i < _receivers.length; i++) {
      balances[_receivers[i]] = balances[_receivers[i]].add(_value);
    }
    
    return true;
  }

  function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
  }
}