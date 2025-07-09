// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ChainLend
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract ChainLend {
    // Deposit token is imBTC, borrow token is USDC
    IERC20 public depositToken;
    IERC20 public borrowToken;
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public debt;

    constructor(address _depositToken, address _borrowToken) {
        depositToken = IERC20(_depositToken);
        borrowToken = IERC20(_borrowToken);
    }

    function deposit(uint256 amount) public {
        uint256 deposited = deposits[msg.sender];
        depositToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] = deposited + amount;
    }

    // Can only be called if the debt is repayed
    function withdraw(uint256 amount) public {
        uint256 deposited = deposits[msg.sender];
        require(
            debt[msg.sender] <= 0,
            "Please clear your debt to Withdraw Collateral"
        );
        require(amount <= deposited, "Withdraw Limit Exceeded");

        deposits[msg.sender] = deposited - amount;
        depositToken.transfer(msg.sender, amount);
    }

    // Assuming correct prices and oracles are in place to calculate the correct borrow limit
    // For smplicity purposes, setting the imBTC oracle price to 20,000 USDC for 1 imBTC.
    function borrow(uint256 amount) public {
        uint256 deposited = deposits[msg.sender];
        uint256 borrowed = debt[msg.sender];
        require(deposited > 0, "You need to deposit before borrowing");

        // BorrowLimit is deposited balance by caller multiplied with the price of imBTC,
        // and then dividing it by 1e8 because USDC decimals is 6 while imBTC is 8
        uint256 borrowLimit = (deposited * 20_000 * 1e6) / 1e8;
        // Finally allowing only 80% of the deposited balance to be borrowed (80% Loan to value)
        borrowLimit = ((borrowLimit * 80) / 100) - borrowed;
        require(amount <= borrowLimit, "BorrowLimit Exceeded");

        debt[msg.sender] += amount;
        borrowToken.transfer(msg.sender, amount);
    }

    function repay(uint256 amount) public {
        require(debt[msg.sender] > 0, "You don't have any debt");
        require(
            amount <= debt[msg.sender],
            "Amount to high! You don't have that much debt"
        );

        borrowToken.transferFrom(msg.sender, address(this), amount);
        debt[msg.sender] -= amount;
    }
}
