// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

/// @title DataStorage contract
/// @author Jay Lee
/// @notice This contract is for storing data using assembly and library.
/// This is for educational purposes only.
contract DataStorage {
  ValueData public data;

  struct ValueData {
    string name;
    uint256 value;
  }

  // A custom type representing the index of a storage slot
  type StoragePointer is bytes32;

  event DataStored(string name, uint256 value);

  /// @notice Set data to the given value
  /// @param _data The data to set the type of which is ValueData
  function setData(ValueData calldata _data) public {
    bytes32 nameSlot = keccak256(abi.encodePacked(_data.name));
    bytes32 valueSlot = keccak256(abi.encodePacked(_data.name, uint256(0)));

    bytes memory name = bytes(_data.name);
    uint256 nameLength = name.length;

    uint256 value = _data.value;

    assembly ("memory-safe") {
      // Using keccak256 to get the storage slot
      let namePtr := add(name, 0x20)
      // let nameLen := 10

      // Store name length
      sstore(nameSlot, nameLength)

      // Store the actual string data
      let dataSlot := add(nameSlot, 1)
      for {
        let i := 0
      } lt(i, nameLength) {
        i := add(i, 0x20)
      } {
        sstore(add(dataSlot, div(i, 0x20)), mload(add(namePtr, i)))
      }

      // Store the value
      sstore(valueSlot, value)
    }

    emit DataStored(_data.name, _data.value);
  }

  /// @notice Get the data
  /// @return The data of type ValueData
  function getData(
    string calldata _name
  ) public view returns (ValueData memory) {
    bytes32 nameSlot = keccak256(abi.encodePacked(_name));
    bytes32 valueSlot = keccak256(abi.encodePacked(_name, uint256(0)));

    ValueData memory _data;
    bytes memory gottonName;
    uint256 value;
    uint256 nameLength;
    assembly {
      // Load the name length from storage
      nameLength := sload(nameSlot)

      // Allocate memory for the gottonName
      gottonName := mload(0x40)
      mstore(gottonName, nameLength)
      mstore(0x40, add(add(gottonName, nameLength), 0x20))

      let strPtr := add(gottonName, 0x20)
      let dataSlot := add(nameSlot, 1)
      for {
        let i := 0
      } lt(i, nameLength) {
        i := add(i, 0x20)
      } {
        mstore(add(strPtr, i), sload(add(dataSlot, div(i, 0x20))))
      }
      // set value and name
      value := sload(valueSlot)
    }

    _data.name = string(gottonName);
    _data.value = value;
    console.log("nameLength: %d", nameLength);
    console.log("name: %s, value: %d", _data.name, _data.value);

    return _data;
  }

  /// @notice Get the value of the data
  /// @return The uint value of the data
  function getDataValue(string calldata _name) public view returns (uint256) {
    bytes32 nameSlot = keccak256(abi.encodePacked(_name));
    bytes32 valueSlot = keccak256(abi.encodePacked(_name, uint256(0)));

    uint256 value;
    uint256 nameLength;
    assembly {
      // Load the name length from storage
      let nameLen := sload(nameSlot)
      nameLength := nameLen
      value := sload(valueSlot)
    }

    return value;
  }
}
