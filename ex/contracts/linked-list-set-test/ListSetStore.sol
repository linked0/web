// SPDX-LIncense-Identifier: MIT
pragma solidity ^0.8.19;

import {AssociatedLinkedListSet, LinkedListSetLib, SENTINEL_VALUE, SetValue} from "../libraries/LinkedListSetLib.sol";

contract ListSetStore {
  using LinkedListSetLib for AssociatedLinkedListSet;

  AssociatedLinkedListSet _set1;

  address internal _associated = address(this);

  struct ValueData {
    uint240 value;
    string description;
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

  function addValue(ValueData calldata data) public {
    _set1.tryAdd(_associated, _getListValue(data.value));
  }
}
