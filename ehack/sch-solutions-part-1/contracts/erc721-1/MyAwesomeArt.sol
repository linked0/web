// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MyAwesomeArt
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract MyAwesomeArt is ERC721 {

    uint16 immutable public MAX_SUPPLY = 10000;
    uint256 immutable public MINT_PRICE = 0.1 ether;

    uint16 public currentSupply = 0;
    
    constructor() ERC721("My Awesome ART", "AWESOME") {}

    function mint() external payable returns (uint16) {

        require(msg.value == MINT_PRICE, "mint costs 0.1 eth");
        require(currentSupply < MAX_SUPPLY, "max supply reached");

        currentSupply += 1;

        _mint(msg.sender, currentSupply);

        return currentSupply;
    }
}