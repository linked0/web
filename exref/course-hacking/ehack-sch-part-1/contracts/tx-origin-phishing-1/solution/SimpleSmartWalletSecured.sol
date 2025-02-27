// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

/**
 * @title SimpleSmartWalletSecured
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract SimpleSmartWalletSecured {
    address public walletOwner;

    constructor() payable {
        walletOwner = msg.sender;
    }

    function transfer(address payable _to, uint _amount) public {
        require(msg.sender == walletOwner, "Only Owner");

        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed");
    }
}