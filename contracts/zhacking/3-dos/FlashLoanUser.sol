// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IShibaPool {
  function flashLoan(uint256 borrowAmount) external;
}

/**
 * @title FlashLoanUser
 * @author Jay Lee
 */
contract FlashLoanUser is Ownable {
  IShibaPool private immutable pool;

  constructor(address poolAddress) {
    pool = IShibaPool(poolAddress);
  }

  function getTokens(address tokenAddress, uint256 amount) external {
    require(msg.sender == address(pool), "Sender must be pool");

    // Return all tokens to the pool
    require(
      IERC20(tokenAddress).transfer(msg.sender, amount),
      "Transfer failed"
    );
  }

  function requestFlashLoan(uint256 amount) external onlyOwner {
    pool.flashLoan(amount);
  }
}
