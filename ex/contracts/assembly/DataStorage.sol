// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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

    bytes calldata name = bytes(_data.name);
    uint256 value = _data.value;

    assembly ("memory-safe") {
      // Using keccak256 to get the storage slot
      let namePtr := add(name.offset, 0x20)
      let nameLen := 1

      // Store name length
      sstore(nameSlot, nameLen)

      // Store the actual string data
      let dataSlot := add(nameSlot, 0x20)
      for {
        let i := 0
      } lt(i, nameLen) {
        i := add(i, 1)
      } {
        sstore(add(dataSlot, mul(i, 0x20)), mload(add(namePtr, mul(i, 0x20))))
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
    bytes memory gottonName = new bytes(0x20);
    uint256 value;
    uint256 nameLength;
    assembly {
      // Load the name length from storage
      let nameLen := sload(nameSlot)
      nameLength := nameLen

      // Allocate memory for the name
      // let namePtr := mload(0x40)
      // mstore(namePtr, nameLen)
      // mstore(0x40, add(namePtr, add(nameLen, 0x20)))
      let strPtr := add(gottonName, 0x20)
      // nameSlot := add(nameSlot, 0x20)
      for {
        let i := 0
      } lt(i, nameLen) {
        i := add(i, 1)
      } {
        mstore(
          add(strPtr, mul(i, 0x20)),
          sload(add(keccak256(add(nameSlot, 0x20), mul(i, 0x20)), 0x20))
        )
      }
      // set value and name
      // mstore(gottonName, namePtr)
      value := sload(valueSlot)
    }

    _data.name = string(gottonName);
    _data.value = value;

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
