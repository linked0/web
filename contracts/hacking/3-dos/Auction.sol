// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Auction
 * @author Jay Lee
 */
contract Auction {
  address payable public currentLeader;
  uint256 public highestBid;

  function bid() external payable {
    require(msg.value > highestBid);
    require(currentLeader.send(highestBid));

    currentLeader = payable(msg.sender);
    highestBid = msg.value;
  }
}
