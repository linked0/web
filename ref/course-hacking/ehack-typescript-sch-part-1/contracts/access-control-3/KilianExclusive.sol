// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title KilianExclusive
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract KilianExclusive is ERC721, Ownable {
    uint16 public totalFragrances = 0;

    struct Fragrance {
        uint16 id;
        string name;
        uint256 mintedAt;
        uint256 lastRefill;
    }

    mapping(uint16 => Fragrance) public fragrances;

    string public baseURI = "https://metaverse.bykilian.com/";
    uint256 public constant fragrancePrice = 10 ether;
    bool public saleIsActive = false;

    constructor() ERC721("Kilian Exclusive", "Kilian") {}

    function setBaseURI(string memory _newURI) public onlyOwner {
        baseURI = _newURI;
    }

    function getFragranceData(
        string memory _fragranceId
    ) public view returns (string memory) {
        return string.concat(baseURI, _fragranceId);
    }

    function purchaseFragrance(uint16 _fragranceId) public payable {
        // Sanity checks
        require(saleIsActive, "Sale must be active to mint a fragerence");
        require(fragrancePrice == msg.value, "Ether value sent is not correct");
        require(
            _fragranceId > 0 && _fragranceId <= totalFragrances,
            "invalid _fragranceId"
        );

        Fragrance storage fragrance = fragrances[_fragranceId];
        require(fragrance.mintedAt == 0, "fragrance already purchased");

        // Mint fragrance
        fragrance.mintedAt = block.timestamp;
        _safeMint(msg.sender, _fragranceId);
    }

    function addFragrance(string memory _name) public onlyOwner {
        totalFragrances += 1;

        Fragrance storage fragrance = fragrances[totalFragrances];
        fragrance.id = totalFragrances;
        fragrance.name = _name;
        fragrance.mintedAt = 0;
        fragrance.lastRefill = 0;
    }

    function refillPerfume(uint16 _fragranceId) public {
        Fragrance storage fragrance = fragrances[_fragranceId];

        require(fragrance.id != 0, "fragrance doesn't exist");
        require(fragrance.mintedAt != 0, "fragrance not sold");

        require(ownerOf(_fragranceId) == msg.sender);

        require(block.timestamp - fragrance.lastRefill > 365 days);
        fragrance.lastRefill = block.timestamp;
    }

    function withdraw(address _to) public {
        require(msg.sender == _to);
        payable(_to).transfer(address(this).balance);
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }
}
