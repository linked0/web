// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.7.0;
// Fixed in solidity ^0.8.0;

library SafeMath {
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }

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
}

/**
 * @title TimeLockSecured
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TimeLockSecured {

    using SafeMath for uint;
    mapping(address => uint) public getBalance;
    mapping(address => uint) public getLocktime;

    function depositETH() public payable {
        getBalance[msg.sender] = getBalance[msg.sender].add(msg.value);
        getLocktime[msg.sender] = block.timestamp.add(1 weeks);
    }

    function increaseMyLockTime(uint _secondsToIncrease) public {
        getLocktime[msg.sender] = getLocktime[msg.sender].add(_secondsToIncrease);
    }

    function withdrawETH() public {
        require(getBalance[msg.sender] > 0);
        require(block.timestamp > getLocktime[msg.sender]);
        uint transferValue = getBalance[msg.sender];
        getBalance[msg.sender] = 0;
        payable(msg.sender).transfer(transferValue);
    }
}