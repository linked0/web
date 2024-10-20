// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IBlockSafe.sol";

contract BlockSafeFactory is Ownable {
    using Clones for address;

    event BlockSafeCreated(address _blockSafeAddress);
    event TemplateChanged(address _previousAddress, address _newAddress);

    address public templateAddress;

    constructor(address _owner, address _templateAddress) {
        require(_templateAddress != address(0));
        setTemplateAddress(_templateAddress);
        _transferOwnership(_owner);
    }

    function setTemplateAddress(address _templateAddress) public onlyOwner {
        require(
            ERC165Checker.supportsInterface(
                _templateAddress,
                type(IBlockSafe).interfaceId
            ),
            "Interface not supported"
        );
        address previousAddress = templateAddress;
        templateAddress = _templateAddress;
        emit TemplateChanged(previousAddress, _templateAddress);
    }

    function createBlockSafe(
        bytes32 _salt,
        address[] calldata _operators
    ) external returns (address) {
        address blockSafeAddress = templateAddress.cloneDeterministic(_salt);

        IBlockSafe(blockSafeAddress).initialize(_operators);

        emit BlockSafeCreated(blockSafeAddress);
        return blockSafeAddress;
    }

    function predictBlockSafeAddress(
        bytes32 _salt
    ) public view returns (address) {
        return
            templateAddress.predictDeterministicAddress(_salt, address(this));
    }
}
