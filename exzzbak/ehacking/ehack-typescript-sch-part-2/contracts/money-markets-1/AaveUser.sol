// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AaveInterfaces.sol";

contract AaveUser is Ownable {
    // TODO: Complete state variables

    // TODO: Complete the constructor
    constructor(address _pool, address _usdc, address _dai) {}

    // Deposit USDC in AAVE Pool
    function depositUSDC(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Update depositedamount state var
        // TODO: Transfer from the sender the USDC to this contract
        // TODO: Supply USDC to aavePool Pool
    }

    // Withdraw USDC
    function withdrawUSDC(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Revert if the user is trying to withdraw more than the deposited amount
        // TODO: Update depositedamount state var
        // TODO: Withdraw the USDC tokens, send them directly to the user
    }

    // Borrow DAI From aave, send DAI to the user (msg.sender)
    function borrowDAI(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Update borrowedAmmount state var
        // TODO: Borrow the DAI tokens in variable interest mode
        // TODO: Transfer DAI token to the user
    }

    // Repay the borrowed DAI to AAVE
    function repayDAI(uint256 _amount) external onlyOwner {
        // TODO: Implement this function
        // TODO: Revert if the user is trying to repay more tokens that he borrowed
        // TODO: Update borrowedAmmount state var
        // TODO: Transfer the DAI tokens from the user to this contract
        // TODO: Approve AAVE Pool to spend the DAI tokens
        // TODO: Repay the loan
    }
}
