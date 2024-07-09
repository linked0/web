// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "hardhat/console.sol";

contract RentingLibrary {
  uint256 public currentRenter;

  function setCurrentRenter(uint256 _renterId) public {
    console.log("called setCurrentRenter in RentingLibrary");
    currentRenter = _renterId;
  }
}
