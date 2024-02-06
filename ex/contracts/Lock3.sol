// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Lock3 {
    uint public unlockTime;
    uint public value = 1;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _value) payable {
        value = _value;
        owner = payable(msg.sender);
    }

    function add() public {
        console.log("Value in Lock is %o", value);
        value += 1;
        console.log("Value2 in Lock is %o", value);
    }
}
