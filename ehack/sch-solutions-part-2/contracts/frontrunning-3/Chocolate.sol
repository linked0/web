// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
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

    IUniswapV2Router02 public immutable uniswapV2Router;

    address public immutable weth;
    address public uniswapV2Pair;
    
    constructor(uint256 _initialMint) ERC20("Chocolate Token", "Choc") {

        // TODO: Mint tokens to owner
        _mint(owner(), _initialMint);
        
        // TODO: SET Uniswap Router Contract
        uniswapV2Router = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

        // TODO: Set WETH (get it from the router)
        weth = uniswapV2Router.WETH();

        // TODO: Create a uniswap Pair with WETH, and store it in the contract
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(address(this), weth);
    }

    /*
        @dev An admin function to add liquidity of chocolate with WETH 
        @dev payable, received Native ETH and converts it to WETH
        @dev lp tokens are sent to contract owner
    */
    function addChocolateLiquidity(uint256 _tokenAmount) external payable onlyOwner {

        // TODO: Transfer the tokens from the sender to the contract
        // Sender should approve the contract spending the chocolate tokens
        _transfer(msg.sender, address(this), _tokenAmount);
        
        // TODO: Convert ETH to WETH
        IWETH(weth).deposit{value: msg.value}();

        // TODO: Approve the router to spend the tokens
        IWETH(weth).approve(address(uniswapV2Router), msg.value);
        _approve(address(this), address(uniswapV2Router), _tokenAmount);

        // TODO: Add the liquidity, using the router, send lp tokens to the contract owner
        uniswapV2Router.addLiquidity(
            address(this),
            weth,
            _tokenAmount,
            msg.value,
            1,
            1,
            owner(),
            block.timestamp
        );
    }
    
    /*
        @dev An admin function to remove liquidity of chocolate with WETH 
        @dev received `_lpTokensToRemove`, removes the liquidity
        @dev and sends the tokens to the contract owner
    */
    function removeChocolateLiquidity(uint256 _lpTokensToRemove) external onlyOwner {
        
        // TODO: Transfer the lp tokens from the sender to the contract
        // Sender should approve token spending for the contract
        IERC20(uniswapV2Pair).transferFrom(msg.sender, address(this), _lpTokensToRemove);

        // TODO: Approve the router to spend the tokens
        IERC20(uniswapV2Pair).approve(address(uniswapV2Router), _lpTokensToRemove);
    
        // TODO: Remove the liquiduity using the router, send tokens to the owner
        uniswapV2Router.removeLiquidity(
            address(this),
            weth,
            _lpTokensToRemove,
            1,
            1,
            owner(),
            block.timestamp
        );
    }

    /*
        @dev User facing helper function to swap chocolate to WETH and ETH to chocolate
        @dev received `_lpTokensToRemove`, removes the liquidity
        @dev and sends the tokens to the contract user that swapped
    */
    function swapChocolates(address _tokenIn, uint256 _amountIn) public payable {

        // TODO: Implement a dynamic function to swap Chocolate to ETH or ETH to Chocolate
        address[] memory path = new address[](2);
        
        if(_tokenIn == address(this)) {
            // TODO: Revert if the user sent ETH
            require(msg.value == 0, "you shouldn't send ETH while swapping chocolates");
            
            // TODO: Set the path array
            path[0] = address(this);
            path[1] = weth;
            
            // TODO: Transfer the chocolate tokens from the sender to this contract
            _transfer(msg.sender, address(this), _amountIn);

            // TODO: Approve the router to spend the chocolate tokens
            _approve(address(this), address(uniswapV2Router), _amountIn);
            
        } else if(_tokenIn == weth) {
            // TODO: Convert ETH to WETH
            IWETH(weth).deposit{value: msg.value}();
            
            // TODO: Set the path array
            path[0] = weth;
            path[1] = address(this);
            
            // TODO: Approve the router to spend the WETH
            IWETH(weth).approve(address(uniswapV2Router), msg.value);
        } else {
            revert("wrong token");
        }

        // TODO: Execute the swap, send the tokens (chocolate / weth) directly to the user (msg.sender)
        uniswapV2Router.swapExactTokensForTokens(
            _amountIn,
            0,
            path,
            msg.sender,
            block.timestamp
        );
    }
}