// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title OpenOcean
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract OpenOcean {
    // TODO: Complete this contract functionality

    // TODO: Constants

    // TODO: Item Struct

    // TODO: State Variables and Mappings

    constructor() {}

    // TODO: List item function
    // 1. Make sure params are correct
    // 2. Increment itemsCounter
    // 3. Transfer token from sender to the contract
    // 4. Add item to listedItems mapping
    function listItem(
        address _collection,
        uint256 _tokenId,
        uint256 _price
    ) external {}

    // TODO: Purchase item function
    // 1. Check that item exists and not sold
    // 2. Check that enough ETH was paid
    // 3. Change item status to "sold"
    // 4. Transfer NFT to buyer
    // 5. Transfer ETH to seller
    function purchase(uint _itemId) external payable {}
}
