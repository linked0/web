// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Dummy ERC721 token, dynamic max supply, free mint!
/**
 * @title DummyERC721
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract DummyERC721 is ERC721, Ownable {
    uint256 maxSupply;
    uint256 public currentSupply = 0;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
    }

    function mint() public returns (uint256) {
        uint256 tokenId = _newTokenId();
        _mint(msg.sender, tokenId);
        return tokenId;
    }

    function safeMint() public returns (uint256) {
        uint256 tokenId = _newTokenId();
        _safeMint(msg.sender, tokenId);
        return tokenId;
    }

    function mintBulk(uint256 _amount) public onlyOwner {
        for (uint256 i = 0; i < _amount; i++) {
            mint();
        }
    }

    function _newTokenId() internal returns (uint256) {
        require(currentSupply < maxSupply, "max supply reached");
        currentSupply += 1;
        return currentSupply;
    }
}
