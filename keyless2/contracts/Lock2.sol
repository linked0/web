// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Lock2 {
    uint public unlockTime;
    address payable public owner;
    bytes4 private constant SEND_SELECTOR = bytes4(keccak256(bytes('send(address,uint256)')));
    address public token;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime, address _token, address _to) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        token = _token;
        owner = payable(msg.sender);

        // Mint DMSToken
        console.log("this address: ", address(this));
        (bool success, ) = token.call(abi.encodeWithSelector(SEND_SELECTOR, _to, 10));
        require(success, "Send failed");
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
