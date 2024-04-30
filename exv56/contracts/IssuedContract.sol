// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./IIssuedContract.sol";

contract IssuedContract is IERC165, IIssuedContract {
  event Received(address, uint256);
  event CommonsBudgetAddressSet(address);

  /// The owner will be incapacitated by being set to 0x0 address
  /// after the Commons Budget contract is completed and its address
  /// is set to this contract.
  address public owner;

  /// The address of the Commons Budget smart contract
  address public commonsBudgetAddress;

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  constructor() {
    owner = msg.sender;
    commonsBudgetAddress = address(0);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) external pure override returns (bool) {
    return
      interfaceId == this.supportsInterface.selector ||
      interfaceId ==
      this.getOwner.selector ^
        this.setOwner.selector ^
        this.getCommonsBudgetAddress.selector ^
        this.setCommonsBudgetAddress.selector ^
        this.transferBudget.selector;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "NotAuthorized");
    _;
  }

  modifier isContract(address _a) {
    uint256 len;
    assembly {
      len := extcodesize(_a)
    }
    require(len > 0, "NotContract");
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

  /// @notice get the address of the Commons Budget contract
  /// @return the address of the Commons Budget contract
  function getCommonsBudgetAddress() external view override returns (address) {
    return commonsBudgetAddress;
  }

  /// @notice set the address of the Commons Budget contract
  /// @param contractAddress the address of the Commons Budget contract
  function setCommonsBudgetAddress(
    address contractAddress
  ) external override onlyOwner isContract(contractAddress) {
    commonsBudgetAddress = contractAddress;
    emit CommonsBudgetAddressSet(contractAddress);
  }

  /// @notice transfer budget to the address of the Commons Budget contract
  /// @param amount the amount to be transferred
  function transferBudget(uint256 amount) external override {
    require(address(this).balance >= amount, "NotEnoughBudget");
    if (commonsBudgetAddress != address(0)) {
      payable(commonsBudgetAddress).transfer(amount);
    }
  }
}
