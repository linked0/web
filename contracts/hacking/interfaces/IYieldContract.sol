// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IYieldContract {
    function underlying() external view returns (address);

    function balanceOf(address) external view returns (uint256);

    function deposit(uint256) external;

    function withdraw(uint256) external;

    function claimRewards() external;
}
