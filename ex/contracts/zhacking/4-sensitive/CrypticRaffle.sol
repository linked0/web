// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrypticRaffle is Ownable, ReentrancyGuard {
  uint256 public constant PARTICIPIATION_PRICE = 0.01 ether;
  bool private isActive = false;
  uint256 raffleId;

  // 3 Numbers between 0-255
  // Example: [53, 0, 123]
  mapping(uint256 => uint8[3]) private raffles;

  constructor() payable {}

  function newRaffle(uint8[3] calldata numbers) external onlyOwner {
    raffleId += 1;
    raffles[raffleId] = numbers;
    isActive = true;
  }

  function guessNumbers(uint8[3] calldata numbers) external payable {
    require(isActive, "Raffle is not active");
    require(numbers.length == 3, "you should guess 3 numbers");
    require(
      msg.value == PARTICIPIATION_PRICE,
      "you should pay 0.1 eth to participate"
    );

    bool succeded = true;

    // Iterate guessed numbers, use should guess all 3 numbers in the right order
    for (uint8 i = 0; i < 3; i++) {
      // If user was wrong with one of the numbers, he lost
      if (numbers[i] != raffles[raffleId][i]) {
        succeded = false;
      }
    }

    // Send bounty and close the raffle if the user won (until next raffle is live)
    if (succeded) {
      isActive = false;
      (bool sent, ) = msg.sender.call{value: address(this).balance}("");
      require(sent, "Failed to send ETH");
    }
  }
}
