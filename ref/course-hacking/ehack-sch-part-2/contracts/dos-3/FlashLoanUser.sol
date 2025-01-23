// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IShibaPool {
    function flashLoan(uint256 borrowAmount) external;
}

/**
 * @title FlashLoanUser
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract FlashLoanUser is Ownable {

    IShibaPool private immutable pool;

    constructor(address poolAddress) {
        pool = IShibaPool(poolAddress);
    }

    // Pool will call this function during the flash loan
    function getTokens(address tokenAddress, uint256 amount) external {
        require(msg.sender == address(pool), "Sender must be pool");
        // Return all tokens to the pool
        require(IERC20(tokenAddress).transfer(msg.sender, amount), "Transfer of tokens failed");
    }

    function requestFlashLoan(uint256 amount) external onlyOwner {
        pool.flashLoan(amount);
    }
}