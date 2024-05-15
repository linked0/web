// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./IPoohnetFund.sol";

contract PoohnetFund is IERC165, IPoohnetFund {
    event Received(address, uint256);

    /// The owner will be incapacitated by being set to 0x0 address
    /// after the Commons Budget contract is completed and its address
    /// is set to this contract.
    address public owner;

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    constructor() {
        owner = msg.sender;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external pure override returns (bool) {
        return
            interfaceId == this.supportsInterface.selector ||
            interfaceId ==
            this.getOwner.selector ^
                this.setOwner.selector ^
                this.transferBudget.selector;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NotAuthorized");
        _;
    }

    /// @notice get the owner of this contract
    /// @return the address of the current owner
    function getOwner() external view override returns (address) {
        return owner;
    }

    /// @notice change the owner of this contract
    /// @param newOwner the address of the new owner
    function setOwner(address newOwner) external override onlyOwner {
        owner = newOwner;
    }

    /// @notice get chain id for teset
    function getChainId() external view override returns (uint256) {
        return block.chainid;
    }

    /// @notice transfer budget to the address of the Commons Budget contract
    /// @param receiver the address of the receiver
    /// @param amount the amount to be transferred
    function transferBudget(
        address receiver,
        uint256 amount
    ) external override {
        require(address(this).balance >= amount, "NotEnoughBudget");
        (bool success, ) = receiver.call{value: amount}("");
        require(success, "POO transfer failed");
    }
}
