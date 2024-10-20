// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract CryptoEmpireGame is IERC1155Receiver {

    IERC1155 public immutable cryptoEmpireToken;
    
    struct Listing {
        address payable seller;
        address buyer;
        uint256 nftId;
        uint256 price;
        bool isSold;
    }

    mapping(address => mapping(uint256 => bool)) public stakedNfts;
    mapping(uint256 => Listing) public listings;

    uint256 public numberOfListings;
    uint256 public constant AMOUNT = 1;

    constructor(address _cryptoEmpireToken) {
        cryptoEmpireToken = IERC1155(_cryptoEmpireToken);
    }

    // List an item fro sale (AMOUNT / quantity is always 1)
    // @audit-issue Doens't implement checks-effects-interactions
    function listForSale(uint256 _nftId, uint256 _price) external {

        require(cryptoEmpireToken.balanceOf(msg.sender, _nftId) > 0, "You don't own this NFT");
        require(_price > 0, "Price should be greater than 0");

        ++numberOfListings;

        cryptoEmpireToken.safeTransferFrom(msg.sender, address(this), _nftId, AMOUNT, "");
        Listing storage listing = listings[numberOfListings];
        listing.seller = payable(msg.sender);
        listing.nftId = _nftId;
        listing.price = _price;
    }

    // Buy a listed item
    // @audit-ok does implement checks-effects-interactions
    function buy(uint256 _listingId) payable external {

        Listing storage listing = listings[_listingId];

        require(listing.seller != address(0), "Listing doesn't exist wrong");
        require(!listing.isSold, "Already sold");
        require(msg.value == listing.price, "Wrong price");

        listing.buyer = msg.sender;
        listing.isSold = true;

        cryptoEmpireToken.safeTransferFrom(address(this), msg.sender, listing.nftId, AMOUNT, "");

        (bool success, ) = listing.seller.call{value: msg.value}("");
        require(success, "Failed to send Ether");
    }

    // Stake NFTs
    // @audit-issue Doens't implement checks-effects-interactions
    function stake(uint256 _nftId) external {

        require(cryptoEmpireToken.balanceOf(msg.sender, _nftId) > 0, "You don't own this NFT");
        require(!stakedNfts[msg.sender][_nftId], "NFT with the same tokenID cannot be staked again");
        
        cryptoEmpireToken.safeTransferFrom(msg.sender, address(this), _nftId, AMOUNT, "");
        stakedNfts[msg.sender][_nftId] = true;
    }

    // Unstake NFTs
    // @audit-issue Doens't implement checks-effects-interactions
    function unstake(uint256 _nftId) external {

        require(stakedNfts[msg.sender][_nftId], "You haven't staked this NFT");

        cryptoEmpireToken.safeTransferFrom(address(this), msg.sender, _nftId, AMOUNT, "");
        stakedNfts[msg.sender][_nftId] = false;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata 
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata 
    ) external pure returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4) external pure returns (bool) {
        return true;
    }
}