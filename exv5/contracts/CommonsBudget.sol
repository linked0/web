// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IIssuedContract.sol";

contract CommonsBudget {
  address issuedContractAddress;

  event Received(address, uint256);

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  constructor() {}

  function setIssuedContractAddress(address contractAddress) external {
    issuedContractAddress = contractAddress;
  }

  function transferBudget(uint256 amount) external {
    IIssuedContract(issuedContractAddress).transferBudget(amount);
  }
}
