// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface ICryptoKeeper {
  function initialize(address[] memory _operators) external;

  function execute(
    address _contractAddress,
    bytes calldata _encodedCalldata,
    uint8 operation
  ) external returns (bytes memory);

  function executeWithValue(
    address _contractAddress,
    bytes calldata _encodedCalldata,
    uint256 _value
  ) external payable returns (bytes memory);

  function addOperator(address _address) external;

  function removeOperator(address _address) external;
}
