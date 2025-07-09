// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IReceiver {
    function getTokens(address tokenAddress, uint256 amount) external;
}

/**
 * @title ShibaPool
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract ShibaPool is ReentrancyGuard {
    IERC20 public immutable shibaToken;
    uint256 public poolBalance;

    constructor(address tokenAddress) {
        shibaToken = IERC20(tokenAddress);
    }

    function depositTokens(uint256 amount) external nonReentrant {
        // Deposit tokens to pool
        require(amount > 0, "amount should be greater than 0");
        shibaToken.transferFrom(msg.sender, address(this), amount);
        poolBalance = poolBalance + amount;
    }

    function flashLoan(uint256 borrowAmount) external nonReentrant {
        // Checks
        require(borrowAmount > 0, "amount should be greater than 0");
        uint256 balanceBefore = shibaToken.balanceOf(address(this));
        require(poolBalance == balanceBefore, "Accounting Issue");
        require(balanceBefore >= borrowAmount, "Not enough tokens in pool");

        // Transfer tokens & callback
        shibaToken.transfer(msg.sender, borrowAmount);
        IReceiver(msg.sender).getTokens(address(shibaToken), borrowAmount);

        // Check balance
        uint256 balanceAfter = shibaToken.balanceOf(address(this));
        require(
            balanceAfter >= balanceBefore,
            "Flash loan hasn't been paid back"
        );
    }
}
