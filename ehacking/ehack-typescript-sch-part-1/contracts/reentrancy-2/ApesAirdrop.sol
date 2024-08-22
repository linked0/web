// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ApesAirdrop
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract ApesAirdrop is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;
    uint16 public maxSupply = 50;

    // Any user in the whitelist can claim 1 NFT
    mapping(address => bool) private claimed;
    mapping(address => bool) private whitelist;

    event AddedToWhitelist(address eligableAddress);
    event Minted(address eligableAddress, uint tokenId);
    event SpotGranted(address from, address to);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() ERC721("Crazy Apes", "APE") {
        owner = msg.sender;
        _tokenIds.increment(); // Start with 1
    }

    function mint() external returns (uint16) {
        // Sender is in whitelist & not claimed
        require(isWhitelisted(msg.sender), "not in whitelist");
        require(!claimed[msg.sender], "already claimed");

        // Check tokenId
        uint16 tokenId = uint16(_tokenIds.current());
        require(tokenId <= maxSupply, "Max supply reached!");
        _tokenIds.increment();

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId);

        // Update claimed
        claimed[msg.sender] = true;

        // Return token ID
        return tokenId;
    }

    function addToWhitelist(address[] memory toAdd) external onlyOwner {
        for (uint i = 0; i < toAdd.length; i++) {
            require(toAdd[i] != address(0), "wrong address");
            whitelist[toAdd[i]] = true;
            emit AddedToWhitelist(toAdd[i]);
        }
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whitelist[addr];
    }

    function grantMyWhitelist(address to) external {
        require(to != address(0), "wrong address");

        // Sender is in whitelist & not claimed
        require(isWhitelisted(msg.sender), "sender not in whitelist");
        require(!claimed[msg.sender], "sender already claimed");

        // Receiver is not in whitelist
        require(!isWhitelisted(to), "receiver already in whitelist");

        whitelist[msg.sender] = false;
        whitelist[to] = true;

        emit SpotGranted(msg.sender, to);
    }
}
