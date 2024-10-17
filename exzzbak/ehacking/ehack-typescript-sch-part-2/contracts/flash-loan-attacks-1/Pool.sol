// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Pool
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract PoolA is ReentrancyGuard {
    using Address for address;
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function requestFlashLoan(
        uint256 amount,
        address borrower,
        address target,
        bytes calldata data
    ) external nonReentrant {
        // Check balance before and validate amount
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= amount, "Not enough tokens in pool");

        // Transfer token & callback
        token.safeTransfer(borrower, amount);
        target.functionCall(data);

        // Validate balance after callback
        uint256 balanceAfter = token.balanceOf(address(this));
        require(
            balanceAfter >= balanceBefore,
            "Flash loan hasn't been paid back"
        );
    }
}
