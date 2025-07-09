// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Token
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Token is ERC20 {

    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, type(uint256).max);
    }
}