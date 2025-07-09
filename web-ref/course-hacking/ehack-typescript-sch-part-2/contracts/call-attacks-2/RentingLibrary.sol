// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract RentingLibrary {
    uint256 public currentRenter;

    function setCurrentRenter(uint256 _renterId) public {
        currentRenter = _renterId;
    }
}
