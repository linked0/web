// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GalacticGorillas
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract GalacticGorillas is ERC721, Ownable {
    
    uint256 constant public MINT_PRICE = 1 ether;
    uint16 constant public MAX_SUPPLY = 10000;
    uint8 constant public MAX_PER_WALLET = 5;

    uint16 public totalSupply;
    bool public paused;

    // Account -> Mint Count
    mapping(address => uint8) public mintCount;

    constructor() ERC721("Galactic Gorillas", "GG") {}

    function mint(uint8 _mintAmount) external payable {
        
        require(!paused, "contract is paused");
        require(_mintAmount > 0 && _mintAmount <= MAX_PER_WALLET, "wrong _mintAmount");
        require(totalSupply + _mintAmount <= MAX_SUPPLY, "exceeded MAX_SUPPLY");
        require(msg.value == MINT_PRICE * _mintAmount, "not enough ETH");
        require(mintCount[msg.sender] + _mintAmount <= MAX_PER_WALLET, "exceeded MAX_PER_WALLET");

        payable(owner()).call{value: msg.value}("");
        mintCount[msg.sender] += _mintAmount;

        for (uint8 i = 1; i <= _mintAmount; i++) {
            totalSupply += 1;
            _safeMint(msg.sender, totalSupply);
        }
    }

    function burn(uint16 _tokenId) external {

        require(!paused, "contract is paused");
        require(_tokenId > 0 && _tokenId <= totalSupply, "wrong _tokenId");
        require(_isApprovedOrOwner(msg.sender, _tokenId), "not owner of the token");

        _burn(_tokenId);
        totalSupply -= 1;
    }

    function pause(bool _state) external onlyOwner {
        paused = _state;
    }

}



