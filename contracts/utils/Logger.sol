// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Logger
 * @dev Logger contract.
 * This contract provides the basic logic for logging.
 */
contract Logger {
  string[] logs;

  function uintToString(
    string memory prefix,
    uint256 _value
  ) internal pure returns (string memory) {
    if (_value == 0) {
      return string(abi.encodePacked(prefix, ": ", "0"));
    }
    uint256 temp = _value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (_value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
      _value /= 10;
    }
    return string(abi.encodePacked(prefix, ": ", string(buffer)));
  }

  function pushLog(string memory log, uint value) public {
    logs.push(uintToString(log, value));
  }

  function getLog(uint index) external returns (string memory) {
    return logs[index];
  }

  function getLogs() external view returns (string[] memory) {
    return logs;
  }

  function clearLogs() external {
    delete logs;
  }
}
