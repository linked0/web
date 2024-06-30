// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IPool {
    function flashLoan(uint256 amount) external;
}

/**
 * @title GreedyReceiver
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract GreedyReceiver {
    IPool pool;

    constructor(address _poolAddress) {
        pool = IPool(_poolAddress);
    }

    // TODO: Implement Greedy Receiver Logic (Not paying back the loan)

    // TODO: Complete this function
    function flashLoan(uint256 amount) external {}

    // TODO: Complete getETH() payable function
}
