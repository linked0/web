// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title Auction
 * @author JohnnyTime (https://smartcontractshacking.com)
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
