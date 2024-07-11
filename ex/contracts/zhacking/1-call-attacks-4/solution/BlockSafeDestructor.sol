// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlockSafeDestructor {
  fallback() external {
    selfdestruct(payable(address(0)));
  }
}
