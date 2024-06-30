// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title Game2
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Game2 {
    // Calculate wins in a row for every player
    mapping(address => uint) public players;
    uint256 lastValue;
    uint8 constant MIN_WINS_IN_A_ROW = 5;

    constructor() payable {}

    function play(bool _guess) external payable {
        require(msg.value == 1 ether, "Playing costs 1 ETH");

        // uint representation of previous block hash
        uint256 value = uint256(blockhash(block.number - 1));
        require(lastValue != value, "One round at a block!");
        lastValue = value;

        // Generate a random number, and check the answer
        uint256 random = value % 2;
        bool answer = random == 1 ? true : false;

        if (answer == _guess) {
            players[msg.sender]++;

            // Did pleayer win 5 times in a row?
            if (players[msg.sender] == MIN_WINS_IN_A_ROW) {
                (bool sent, ) = msg.sender.call{value: address(this).balance}(
                    ""
                );
                require(sent, "Failed to send ETH");
                players[msg.sender] = 0;
            }
        } else {
            players[msg.sender] = 0;
        }
    }
}
