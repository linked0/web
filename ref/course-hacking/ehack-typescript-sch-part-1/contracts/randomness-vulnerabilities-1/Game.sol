// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title Game
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Game {
    constructor() payable {}

    function play(uint guess) external {
        uint number = uint(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.number,
                    block.prevrandao // <-- the new identifier for block.difficulty
                )
            )
        );

        if (guess == number) {
            (bool sent, ) = msg.sender.call{value: address(this).balance}("");
            require(sent, "Failed to send ETH");
        }
    }
}
