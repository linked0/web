// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

interface IPoohnetFund {
    /// @notice get the owner of this contract
    /// @return the address of the current owner
    function getOwner() external view returns (address);

    /// @notice change the owner of this contract
    /// @param newOwner the address of the new owner
    function setOwner(address newOwner) external;

    /// @notice get chain id for teset
    function getChainId() external view returns (uint256);

    /// @notice transfer budget to the Commons Budget contract
    /// @param receiver the address of the receiver
    /// @param amount the amount to be transferred
    function transferBudget(address receiver, uint256 amount) external;
}
