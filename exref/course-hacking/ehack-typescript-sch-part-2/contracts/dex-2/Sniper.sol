// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "../interfaces/IUniswapV2.sol";

/**
 * @title Sniper
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Sniper is Ownable {
    // We are calculating `amountOut = amountOut * slippage / 1000.
    // So, if we set slippage to 1000, it means no slippage at all, because 1000 / 1000 = 1
    // Initally we try to purchase without slippage
    uint private constant INITIAL_SLIPPAGE = 1000;
    // Every failed attemp we will increase the slippage by 0.3% (3 / 1000)
    uint private constant SLIPPAGE_INCREMENTS = 3;

    IUniswapV2Factory private immutable factory;

    constructor(address _factory) {
        factory = IUniswapV2Factory(_factory);
    }

    /**
     * The main external snipe function that is being called by the contract owner.
     * Checks the the current reserves, determines the expected amountOut.
     * If amountOut >= `_absoluteMinAmountOut`, it will try to swap the tokens `_maxRetries` times
     * using the internal `_swapWithRetries` function.
     * @param _tokenIn the token address you want to sell
     * @param _tokenOut the token address you want to buy
     * @param _amountIn the amount of tokens you are sending in
     * @param _absoluteMinAmountOut the minimum amount of tokens you want out of the trade
     * @param _maxRetries In case the swap fails, it will try again _maxRetries times (with higher slippage tolerance every time)
     */
    function snipe(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _absoluteMinAmountOut,
        uint8 _maxRetries
    ) external onlyOwner {
        // TODO: Implement this function

        // TODO: Use the Factory to get the pair contract address, revert if pair doesn't exist
        // Note: might return error - if the pair is not created yet

        // TODO: Sort the tokens using the internal `_sortTokens` function

        uint256 amountOut;
        // NOTE: We're using block to avoid "stack too deep" error
        {
            // TODO: Get pair reserves, and match them with _tokenIn and _tokenOut
            // TODO: Get the expected amount out and revert if it's lower than the `_absoluteMinAmountOut`
            // NOTE: Use the internal _getAmountOut function
        }

        // TODO: Transfer the token to the pair contract

        // TODO: Set amount0Out and amount1Out, based on token0 & token1

        // TODO: Call internal _swapWithRetreis function with the relevant parameters

        // TODO: Transfer the sniped tokens to the owner
    }

    /**
     * Internal function that will try to swap the tokens using the pair contract
     * In case the swap failed, it will call itself again with higher slippage
     * and try again until the swap succeded or `_maxRetries`
     */
    function _swapWithRetries(
        address _pair,
        uint256 _amount0Out,
        uint256 _amount1Out,
        uint8 _maxRetries,
        uint8 _retryNo
    ) internal pure {
        // TODO: Implement this function

        // Our slippage tolerance. Every retry we will be willinig to pay 0.3% more for the tokens
        // The slippage will be calculated by `amountOut * slippage / 1000`, so
        // 0.3% = 997, 0.6% = 994, and so on..
        uint256 slippageTolerance;

        // TODO: Revert if we reached max retries

        // TODO: Set the slippage tolerance based on the _retryNo
        // TODO: Start from INITIAL_SLIPPAGE, then every retry we reduce SLLIPAGE_INCREMENTS

        // TODO: Apply the slippage to the amounts

        // TODO: Call the low-level pair swap() function with all the parameters
        // TODO: In case it failed, call _swapWithRetreis again (don't forget to increment _retryNo)
    }

    /**
     * Internal function to sort the tokens by their addresses
     * Exact same logic like in the Unsiwap Factory `createPair()` function.
     */
    function _sortTokens(
        address tokenA,
        address tokenB
    ) internal pure returns (address token0, address token1) {
        // TODO: Implement tokens sorting functionality as in Uniswap V2 Factory `createPair` function
    }

    /**
     * Internal function to get the expected amount of tokens which we will receive based on given `amountIn` and pair reserves.
     * Exact same logic like in the Unsiwap Library `_getAmountOut()` function.
     */
    function _getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) internal pure returns (uint amountOut) {
        // TODO: Implement functionality as in Uniswap V2 Library `getAmountOut` function
    }
}
