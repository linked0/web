// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * Manage deposits and stakes.
 * Deposit is just a balance used to pay for UserOperations (either by a paymaster or an account).
 * Stake is value locked for at least "unstakeDelay" by the staked entity.
 */
interface IStakeManager {
  event Deposited(address indexed account, uint256 totalDeposit);

  // API struct used by getStakeInfo and simulateValidation.
  struct StakeInfo {
    uint256 stake;
    uint256 unstakeDelaySec;
  }
}
