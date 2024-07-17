// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IYieldContract.sol";
import "./OptimizerStrategyManager.sol";

contract OptimizerStrategy is OptimizerStrategyManager {
  using SafeERC20 for IERC20;

  // We accept {want} and accumulate rewards in {want}.
  address public want;
  IYieldContract public yieldContract;

  /**
   * @dev Events that the contract emits
   */
  event StratHarvest(address indexed harvester, uint256 wantHarvested);
  event FundsPutToWork(uint256 wantAmount);
  event Deposit(uint256 tvl);
  event Withdraw(uint256 tvl);

  /**
   * @param _yieldContract the contract that will hold the yielding position and pay out {want} rewards
   */
  constructor(address _yieldContract) public OptimizerStrategyManager() {
    yieldContract = IYieldContract(_yieldContract);
    want = IYieldContract(yieldContract).underlying();

    IERC20(want).safeApprove(_yieldContract, type(uint256).max);
  }

  /**
   * @dev Deposit into the strategy and put funds to work.
   */
  function deposit() public {
    uint256 wantBal = balanceOfWant();
    if (wantBal > 0) _putToWork(wantBal);

    emit Deposit(balanceOf());
  }

  /**
   * @dev Compound the vault's rewards back into the yielding position.
   */
  function harvest() external virtual {
    uint256 balBefore = balanceOfWant();

    yieldContract.claimRewards();

    uint256 rewardsClaimed = balBefore - balanceOfWant();
    uint256 harvestFeeAmount = (rewardsClaimed * harvestFee) / FEE_DIVISOR;

    IERC20(want).safeTransfer(msg.sender, harvestFeeAmount);
    yieldContract.deposit(rewardsClaimed - harvestFeeAmount);

    emit StratHarvest(msg.sender, rewardsClaimed);
  }

  /**
   * @dev Withdraw funds and send them back to the vault.
   * @param _amount How much {want} to withdraw.
   */
  function withdraw(uint256 _amount) external onlyVault {
    uint256 wantBal = balanceOfWant();

    // @notice ignore deflationary tokens
    if (wantBal < _amount) yieldContract.withdraw(_amount - wantBal);

    // withdrawal fee is simply redistributed to the other vault depositors
    uint256 withdrawalFeeAmount = (_amount * withdrawalFee) / FEE_DIVISOR;

    IERC20(want).safeTransfer(vault, _amount - withdrawalFeeAmount);
    emit Withdraw(balanceOf());
  }

  /**
   * @dev Put _amount of {want} to work in the {yieldContract}
   * @param _amount amount of {want} to deposit into the yield contract.
   */
  function _putToWork(uint256 _amount) internal {
    yieldContract.deposit(_amount);
    emit FundsPutToWork(_amount);
  }

  /**
   * @dev get the total {want} held by the strategy, both deployed and in this contract.
   */
  function balanceOf() public view returns (uint256) {
    return balanceOfWant() + yieldContract.balanceOf(address(this));
  }

  /**
   * @dev get how much {want} this contract holds.
   */
  function balanceOfWant() public view returns (uint256) {
    return IERC20(want).balanceOf(address(this));
  }
}
