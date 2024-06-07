// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Lock.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import {AssociatedLinkedListSet, LinkedListSetLib, SENTINEL_VALUE, SetValue} from "./libraries/LinkedListSetLib.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

// E000 : No description

contract AllPairVault {
  using LinkedListSetLib for AssociatedLinkedListSet;

  uint public unlockTime;
  address payable public owner;
  address public impl;
  Lock public lock;

  AssociatedLinkedListSet _set1;
  address internal _associated = address(this);

  struct ValueData {
    uint240 value;
    string description;
  }

  event ValueAdded(uint240 value, string description);
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

  // User-defined function for wrapping from bytes30 (uint240) to SetValue
  // Can defind a custom one for address, uints, etc.abi
  function _getListValue(uint240 value) internal pure returns (SetValue) {
    return SetValue.wrap(bytes30(value));
  }

  function add(SetValue value) public {
    _set1.tryAdd(_associated, value);
  }

  function contains(SetValue value) public view returns (bool) {
    return _set1.contains(_associated, value);
  }

  function addValue(ValueData calldata data) public returns (bool) {
    bool result = _set1.tryAdd(_associated, _getListValue(data.value));
    require(bytes(data.description).length > 0, "E000");

    emit ValueAdded(data.value, data.description);
    return result;
  }
}
