// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "../interfaces/IUniswapV2.sol";

interface IWETH is IERC20 {
    function deposit() external payable;

    function transfer(address to, uint value) external returns (bool);

    function withdraw(uint) external;
}

/**
 * @title Chocolate
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Chocolate is ERC20, Ownable {
    using Address for address payable;

    IUniswapV2Router02 public uniswapV2Router;

    address public weth;
    address public uniswapV2Pair;

    constructor(uint256 _initialMint) ERC20("Chocolate Token", "Choc") {
        // TODO: Mint tokens to owner
        // TODO: SET Uniswap Router Contract
        // TODO: Set WETH (get it from the router)
        // TODO: Create a uniswap Pair with WETH, and store it in the contract
    }

    /*
        @dev An admin function to add liquidity of chocolate with WETH 
        @dev payable, received Native ETH and converts it to WETH
        @dev lp tokens are sent to contract owner
    */
    function addChocolateLiquidity(
        uint256 _tokenAmount
    ) external payable onlyOwner {
        // TODO: Transfer the tokens from the sender to the contract
        // Sender should approve the contract spending the chocolate tokens
        // TODO: Convert ETH to WETH
        // TODO: Approve the router to spend the tokens
        // TODO: Add the liquidity, using the router, send lp tokens to the contract owner
    }

    /*
        @dev An admin function to remove liquidity of chocolate with WETH 
        @dev received `_lpTokensToRemove`, removes the liquidity
        @dev and sends the tokens to the contract owner
    */
    function removeChocolateLiquidity(
        uint256 _lpTokensToRemove
    ) external onlyOwner {
        // TODO: Transfer the lp tokens from the sender to the contract
        // Sender should approve token spending for the contract
        // TODO: Approve the router to spend the tokens
        // TODO: Remove the liquiduity using the router, send tokens to the owner
    }

    /*
        @dev User facing helper function to swap chocolate to WETH and ETH to chocolate
        @dev received `_lpTokensToRemove`, removes the liquidity
        @dev and sends the tokens to the contract user that swapped
    */
    function swapChocolates(
        address _tokenIn,
        uint256 _amountIn
    ) public payable {
        // TODO: Implement a dynamic function to swap Chocolate to ETH or ETH to Chocolate

        if (_tokenIn == address(this)) {
            // TODO: Revert if the user sent ETH
            // TODO: Set the path array
            // TODO: Transfer the chocolate tokens from the sender to this contract
            // TODO: Approve the router to spend the chocolate tokens
        } else if (_tokenIn == weth) {
            // TODO: Make sure msg.value equals _amountIn
            // TODO: Convert ETH to WETH
            // TODO: Set the path array
            // TODO: Approve the router to spend the WETH
        } else {
            revert("wrong token");
        }

        // TODO: Execute the swap, send the tokens (chocolate / weth) directly to the user (msg.sender)
    }
}
