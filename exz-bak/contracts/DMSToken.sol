// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DMSToken is ERC20 {
  constructor(
    string memory name_,
    string memory symbol_
  ) ERC20(name_, symbol_) {
    _mint(msg.sender, 1000);
  }

  function send(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
