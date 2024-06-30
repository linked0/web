// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title A mintable and burnable ERC20 token
/**
 * @title ShibaToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract ShibaToken is ERC20Burnable, Ownable {
    constructor(uint _initialSupply) ERC20("Shiba Token", "SHIBA") {
        mint(msg.sender, _initialSupply);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
