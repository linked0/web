// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Sum {
  function sumArray(uint256[] memory data) public pure returns (uint256) {
    uint256 sum = 0;
    for (uint256 i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum;
  }
}
