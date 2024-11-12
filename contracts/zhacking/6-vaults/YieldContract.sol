// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract YieldContract {
  using SafeERC20 for IERC20;

  event RewardsClaimed(address claimer);
  address public underlying;

  mapping(address => uint256) public balanceOf;

  constructor(address _underlying) {
    underlying = _underlying;
  }

  function deposit(uint256 _amount) external {
    IERC20(underlying).safeTransferFrom(msg.sender, address(this), _amount);
    balanceOf[msg.sender] += _amount;
  }

  function withdraw(uint256 _amount) external {
    balanceOf[msg.sender] -= _amount;
    IERC20(underlying).safeTransfer(msg.sender, _amount);
  }

  function claimRewards() external {
    // No rewards are accumulated in this stub contract
    emit RewardsClaimed(msg.sender);
  }
}
