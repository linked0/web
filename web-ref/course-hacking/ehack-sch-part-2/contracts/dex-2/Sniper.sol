// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

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
  uint private constant SLLIPAGE_INCREMENTS = 3; 

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
    address _tokenIn, address _tokenOut, uint256 _amountIn,
    uint256 _absoluteMinAmountOut, uint8 _maxRetries)
    external onlyOwner {
    // TODO: Implement this function

    // TODO: Use the Factory to get the pair contract address, revert if pair doesn't exist
    // Note: might return error - if the pair is not created yet
    address pair = factory.getPair(_tokenIn, _tokenOut);
    require(pair != address(0), "pair wasn't created yet");

    // TODO: Sort the tokens using the internal `_sortTokens` function
    (address token0, address token1) = _sortTokens(_tokenIn, _tokenOut);

    uint256 amountOut;
    // NOTE: We're using block to avoid "stack too deep" error
    {
      // TODO: Get pair reserves, and match them with _tokenIn and _tokenOut
      (uint reserve0, uint reserve1, ) = IUniswapV2Pair(pair).getReserves();
      (uint reserveIn, uint reserveOut) = _tokenIn == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
      
      // TODO: Get the expected amount out and revert if it's lower than the `_absoluteMinAmountOut`
      // NOTE: Use the internal _getAmountOut function
      amountOut = _getAmountOut(_amountIn, reserveIn, reserveOut);
      require(amountOut >= _absoluteMinAmountOut, "amountOut is not sufficient");
    }

    // TODO: Transfer the token to the pair contract
    IERC20(_tokenIn).transfer(address(pair), _amountIn);

    // TODO: Set amount0Out and amount1Out, based on token0 & token1
    (uint256 amount0Out, uint256 amount1Out) = _tokenIn == token0 ? (uint256(0), amountOut) : (amountOut, uint256(0));

    // TODO: Call internal _swapWithRetreis function with the relevant parameters
    _swapWithRetries(address(pair), amount0Out, amount1Out, _maxRetries, 0);

    // TODO: Transfer the sniped tokens to the owner
    IERC20(_tokenOut).transfer(owner(), IERC20(_tokenOut).balanceOf(address(this)));
  }

  /**
   * Internal function that will try to swap the tokens using the pair contract
   * In case the swap failed, it will call itself again with higher slippage
   * and try again until the swap succeded or `_maxRetries`
   */
  function _swapWithRetries(
    address _pair, uint256 _amount0Out, uint256 _amount1Out, uint8 _maxRetries, uint8 _retryNo
    ) internal {
    // TODO: Implement this function

    // Our slippage tolerance. Every retry we will be willinig to pay 0.3% more for the tokens
    // The slippage will be calculated by `amountOut * slippage / 1000`, so
    // 0.3% = 997, 0.6% = 994, and so on..
    uint256 slippageTolerance;


    // TODO: Revert if we reached max retries
    require(_retryNo <= _maxRetries, "failed, reached max retires, without success");

    // TODO: Set the slippage tolerance based on the _retryNo
    // TODO: Start from INITIAL_SLIPPAGE, then every retry we reduce SLLIPAGE_INCREMENTS
    slippageTolerance = _retryNo == 0 ? INITIAL_SLIPPAGE : INITIAL_SLIPPAGE - _retryNo * SLLIPAGE_INCREMENTS;

    // TODO: Apply the slippage to the amounts
    uint256 _adjustedAmount0Out = _amount0Out * slippageTolerance / 1000;
    uint256 _adjustedAmount1Out = _amount1Out * slippageTolerance / 1000;

    // TODO: Call the low-level pair swap() function with all the parameters
    // TODO: In case it failed, call _swapWithRetreis again (don't forget to increment _retryNo)

    try IUniswapV2Pair(_pair).swap(_adjustedAmount0Out, _adjustedAmount1Out, address(this), new bytes(0)) {
    } catch {
      _swapWithRetries(_pair, _amount0Out, _amount1Out, _maxRetries, _retryNo+ 1);
    }
  }

  /**
   * Internal function to sort the tokens by their addresses
   * Exact same logic like in the Unsiwap Factory `createPair()` function.
   */
  function _sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
    // TODO: Implement tokens sorting functionality as in Uniswap V2 Factory `createPair` function
    require(tokenA != tokenB, 'UniswapV2: IDENTICAL_ADDRESSES');
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), 'UniswapV2: ZERO_ADDRESS');
  }

  /**
   * Internal function to get the expected amount of tokens which we will receive based on given `amountIn` and pair reserves.
   * Exact same logic like in the Unsiwap Library `_getAmountOut()` function.
   */
  function _getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
      // TODO: Implement functionality as in Uniswap V2 Library `getAmountOut` function

      require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
      require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
      uint amountInWithFee = amountIn * 997;
      uint numerator = amountInWithFee * reserveOut;
      uint denominator = reserveIn * 1000 + amountInWithFee;
      amountOut = numerator / denominator;
  }
  
}