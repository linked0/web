// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OptimizerStrategyManager is Ownable {
  uint256 constant FEE_DIVISOR = 1000;
  uint256 constant HARVEST_FEE_CAP = 30; // 3% cap on the harvest fee
  uint256 constant WITHDRAWAL_FEE_CAP = 20; // 2% cap on the withdrawal fee

  // The currently appointed vault for this strategy
  address public vault;
  uint256 public harvestFee;
  uint256 public withdrawalFee;

  error NotVault();
  error InvalidFee();

  /**
   * @dev Initializes a base strategy.
   */
  constructor() public {
    harvestFee = 15; // Initial fee of 1.5%
    withdrawalFee = 10; // Initial fee of 1%
  }

  // checks that caller is the appointed vault contract.
  modifier onlyVault() {
    if (msg.sender != vault) revert NotVault();
    _;
  }

  /**
   * @dev Updates parent vault.
   * @param _vault new vault address.
   */
  function setVault(address _vault) external onlyOwner {
    vault = _vault;
  }

  /**
   * @dev Updates the harvest fee.
   * @param _newFee new fee amount.
   */
  function setHarvestFee(uint256 _newFee) external onlyOwner {
    if (_newFee > HARVEST_FEE_CAP) revert InvalidFee();
    harvestFee = _newFee;
  }

  /**
   * @dev Updates the withdrawal fee.
   * @param _newFee new fee amount.
   */
  function setWithdrawalFee(uint256 _newFee) external onlyOwner {
    if (_newFee > WITHDRAWAL_FEE_CAP) revert InvalidFee();
    withdrawalFee = _newFee;
  }
}
