// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IPool {
    function flashLoan(uint256 amount) external;
}

/**
 * @title Receiver
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Receiver {
    IPool pool;

    constructor(address _poolAddress) {
        pool = IPool(_poolAddress);
    }

    // TODO: Implement Receiver logic (Receiving a loan and paying it back)

    // TODO: Complete this function
    function flashLoan(uint256 amount) external {}

    // TODO: Complete getETH() payable function
}
