// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CompoundInterfaces.sol";

contract CompoundUser is Ownable {
    IComptroller private comptroller;

    IERC20 private usdc;
    IERC20 private dai;

    cERC20 private cUsdc;
    cERC20 private cDai;

    uint256 public depositedAmount; // In USDC
    uint256 public borrowedAmount; // In DAI

    // TODO: Implement the constructor
    constructor(address _comptroller, address _cUsdc, address _cDai) {
        // TODO: Set the comptroller, cUsdc, and cDai contracts
        // TODO: Set the usdc, and dai contract (retrieve from cToken contracts)
    }

    // Deposit USDC to Compound
    function deposit(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Update depositedAmount state var
        // TODO: Transfer the USDC from the user to this smart contract
        // TODO: Approve the cUsdc contract to spend our USDC tokens
        // TODO: Deposit USDC tokens (mint cUSDC tokens)
    }

    // Allow the deposited USDC to be used as collateral, interact with the Comptroller contract
    function allowUSDCAsCollateral() external onlyOwner {
        // TODO: Implement this function
        // TODO: Use the comptroller `enterMarkets` function to set the usdc as collateral
    }

    // Withdraw deposited USDC from Compound
    function withdraw(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Revert if the user is trying to withdraw more than he deposited
        // TODO: Update depositedAmount amount state var
        // TODO: Withdraw the USDC tokens
        // TODO: Transfer USDC token to the user
    }

    // Borrow DAI from Compound
    function borrow(uint256 _amount) external {
        // TODO: Implement this function
        // TODO: Update borrowedAmount state var
        // TODO: Borrow DAI
        // TODO: Send DAI to the user
    }

    // Repay the borrowed DAI
    function repay(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Revert if the user is trying to repay more tokens than he borrowed
        // TODO: Update borrowedAmount state var
        // TODO: Transfer the DAI tokens from the user to this contract
        // TODO: Approve Compound cToken contract to spend the DAI tokens
        // TODO: Repay the loan
    }
}
