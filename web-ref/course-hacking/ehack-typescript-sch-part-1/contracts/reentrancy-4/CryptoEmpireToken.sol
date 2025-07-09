// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoEmpireToken is ERC1155, Ownable {
    enum NftId {
        HELMET,
        SWORD,
        ARMOUR,
        SHIELD,
        CROSSBOW,
        DAGGER
    }

    constructor() ERC1155("someuri") {}

    function setURI(string memory _newuri) public onlyOwner {
        _setURI(_newuri);
    }

    function mint(
        address _account,
        uint256 _amount,
        NftId _id
    ) public onlyOwner {
        _mint(_account, uint256(_id), _amount, "");
    }
}
