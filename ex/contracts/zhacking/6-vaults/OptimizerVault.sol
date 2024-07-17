// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../interfaces/IOptimizerStrategy.sol";

import "hardhat/console.sol";

/**
 * @notice Implementation of a vault to deposit funds into for yield optimizing.
 * This is the vault contract that users interface with and send funds to.
 * The strategy contract that actually does the yield optimizing is included in ./OptimizerStrategy.sol.
 */
contract OptimizerVault is ERC20, ReentrancyGuard {
  using SafeERC20 for IERC20;

  // The strategy that is managing the money in the system.
  IOptimizerStrategy public strategy;

  /**
   * @param _strategy the address of the strategy.
   * @param _name the name of the vault token.
   * @param _symbol the symbol of the vault token.
   */
  constructor(
    IOptimizerStrategy _strategy,
    string memory _name,
    string memory _symbol
  ) public ERC20(_name, _symbol) {
    strategy = _strategy;
  }

  /**
   * @dev The token accepted by the Vault system.
   */
  function want() public view returns (IERC20) {
    return IERC20(strategy.want());
  }

  /**
   * @dev Get the total underlying value of {want} deposited in the system.
   * Account for the vault contract balance, the strategy contract balance
   * and the balance allocated to other contracts/systems as part of the strategy.
   */
  function balance() public view returns (uint256) {
    return
      want().balanceOf(address(this)) +
      IOptimizerStrategy(strategy).balanceOf();
  }

  /**
   * @dev Get the available {want}.
   */
  function available() public view returns (uint256) {
    return want().balanceOf(address(this));
  }

  /**
   * @dev Send deposited funds to the strategy. The strategy is then responsible for
   * putting the funds to work.
   */
  function sendToStrat() public {
    want().safeTransfer(address(strategy), available());
    strategy.deposit();
  }

  /**
   * @dev This is how user's enter the vault system. The vault accepts user funds
   * and relays them to the strategy to be put to work.
   */
  function deposit(uint256 _amount) external nonReentrant {
    uint256 _pool = balance();

    want().safeTransferFrom(msg.sender, address(this), _amount); // @notice we do not check for deflationary tokens
    sendToStrat();

    uint256 shares = 0;
    if (totalSupply() == 0) shares = _amount;
    else shares = (_amount * totalSupply()) / _pool;

    _mint(msg.sender, shares);
  }

  /**
   * @dev Withdraw funds from the system. Withdraw the necessary tokens
   * from the strategy in order to pay the user. The user's vault tokens are then burned.
   */
  function withdraw(uint256 _shares) external nonReentrant {
    uint256 _amount = (balance() * _shares) / totalSupply();
    _burn(msg.sender, _shares);

    uint256 _balance = want().balanceOf(address(this)); // Get the available {want} in this contract

    if (_balance < _amount) {
      strategy.withdraw(_amount - _balance);
      _amount = want().balanceOf(address(this));
    }

    want().safeTransfer(msg.sender, _amount);
  }
}
