// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

/**
 * @title EtherBank
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract EtherBank {

    mapping(address => uint256) public balances;

    function depositETH() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawETH() public {

        uint256 balance = balances[msg.sender];

        // Send ETH 
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdraw failed");

        // Update Balance
        balances[msg.sender] = 0;
    }
}