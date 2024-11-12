// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SecuredEtherBank
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract SecuredEtherBank is ReentrancyGuard {

    mapping(address => uint256) public balances;
    bool private locked = false;

    modifier protected() {
        require(!locked, "no reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function depositETH() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawETH() public nonReentrant {

        uint256 balance = balances[msg.sender];

        // Update Balance
        balances[msg.sender] = 0;

        // Send ETH 
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw failed");
    }
}