// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./libraries/PoohLibrary.sol";

contract Ondo is Ownable {
    /// @notice The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
    );

    constructor() Ownable(msg.sender) {
        console.log("Ondo contract deployed by", owner());
        string memory name = PLib.bytes32ToString(DOMAIN_TYPEHASH);
        console.log("Ondo contract typehash", name);
    }
}