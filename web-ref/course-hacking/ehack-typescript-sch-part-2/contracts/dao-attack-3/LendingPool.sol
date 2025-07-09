// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IDAOToken {
    function balanceOf(address account) external returns (uint);

    function transfer(address to, uint amount) external;
}

interface IFlashLoanReceiver {
    function callBack(uint borrowAmount) external;
}

/**
 * @title LendingPool
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract LendingPool is ReentrancyGuard {
    using Address for address;

    IDAOToken public token;

    constructor(address tokenAddress) {
        token = IDAOToken(tokenAddress);
    }

    function flashLoan(uint256 borrowAmount) external nonReentrant {
        // Before checks
        require(msg.sender.isContract(), "Must be a contract");
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= borrowAmount, "Not enough liquidity");

        token.transfer(msg.sender, borrowAmount);
        IFlashLoanReceiver(msg.sender).callBack(borrowAmount);

        // After checks
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, "Need to pay the loan back");
    }
}
