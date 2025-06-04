// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IOptimizerStrategy {
    function vault() external view returns (address);

    function want() external view returns (address);

    function deposit() external;

    function withdraw(uint256) external;

    function balanceOf() external view returns (uint256);

    function harvest() external;
}
