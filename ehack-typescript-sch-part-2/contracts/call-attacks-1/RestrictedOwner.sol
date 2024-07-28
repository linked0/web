// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title RestrictedOwner
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract RestrictedOwner {
    address public owner;
    address public manager;
    address public unrestrictedOwnerAddress;

    constructor(address _unrestrictedOwnerAddress) {
        unrestrictedOwnerAddress = _unrestrictedOwnerAddress;
        owner = msg.sender;
        manager = msg.sender;
    }

    function updateSettings(address _newOwner, address _newManager) public {
        require(msg.sender == owner, "Not owner!");
        owner = _newOwner;
        manager = _newManager;
    }

    fallback() external {
        (bool result, ) = unrestrictedOwnerAddress.delegatecall(msg.data);
        if (!result) {
            revert("failed");
        }
    }
}
