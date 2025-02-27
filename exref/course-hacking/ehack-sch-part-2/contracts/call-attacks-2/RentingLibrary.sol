// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract RentingLibrary {
    uint256 public currentRenter;

    function setCurrentRenter(uint256 _renterId) public {
        currentRenter = _renterId;
    }
}