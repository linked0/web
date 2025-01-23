// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RealtyToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract RealtyToken is Ownable, ERC721("Realty Token", "RLTY") {
    uint256 public lastTokenID = 0;
    uint256 public maxSupply = 100;

    constructor() {}

    function mint(address to) external onlyOwner {
        require(lastTokenID < maxSupply, "Max Supply Reached");

        unchecked {
            ++lastTokenID;
        }

        uint256 tokenId = lastTokenID;

        _safeMint(to, tokenId);
    }
}
