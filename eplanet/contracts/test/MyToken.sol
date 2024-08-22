// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
  event Mint(address indexed to, uint256 amount);

  uint256 constant INITIAL_SUPPLY = 1000000 * (10 ** 18);

  constructor() ERC20("MyToken", "MTK") {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

  function mint(address to) public {
    _mint(to, 1 ether);
    emit Mint(to, 1 ether);
  }
}
