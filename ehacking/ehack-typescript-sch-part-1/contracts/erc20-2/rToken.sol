// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
// UNLICENSED means no usage allowed: https://docs.soliditylang.org/en/v0.8.21/layout-of-source-files.html

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title rToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract rToken is ERC20 {
    // TODO: Complete this contract functionality
    constructor(
        address _underlyingToken,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {}
}
