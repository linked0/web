// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IIssuedContract {
  /// @notice get the owner of this contract
  /// @return the address of the current owner
  function getOwner() external view returns (address);

  /// @notice change the owner of this contract
  /// @param newOwner the address of the new owner
  function setOwner(address newOwner) external;

  /// @notice get chain id for teset
  function getChainId() external view returns (uint256);

  /// @notice get the address of the Commons Budget contract
  /// @return the address of the Commons Budget contract
  function getCommonsBudgetAddress() external returns (address);

  /// @notice set the address of the Commons Budget contract
  /// @param contractAddress the address of the Commons Budget contract
  function setCommonsBudgetAddress(address contractAddress) external;

  /// @notice transfer budget to the Commons Budget contract
  /// @param amount the amount to be transferred
  function transferBudget(uint256 amount) external;
}
