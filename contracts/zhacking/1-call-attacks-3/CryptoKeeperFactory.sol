// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoKeeper.sol";

contract CryptoKeeperFactory is Ownable
{
    using Clones for address;

    event CryptoKeeperCreated(address _cryptoKeeperAddress);
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
                type(ICryptoKeeper).interfaceId
            ),
            "Interface not supported"
        );
        address previousAddress = templateAddress;
        templateAddress = _templateAddress;
        emit TemplateChanged(previousAddress, _templateAddress);
    }

    function createCryptoKeeper(
        bytes32 _salt,
        address[] calldata _operators
    )
        external
        returns (address)
    {
        address cryptoKeeperAddress = templateAddress.cloneDeterministic(_salt);

        ICryptoKeeper(cryptoKeeperAddress).initialize(_operators);

        emit CryptoKeeperCreated(cryptoKeeperAddress);
        return cryptoKeeperAddress;
    }

    function predictCryptoKeeperAddress(bytes32 _salt)
        public
        view
        returns (address)
    {
        return
            templateAddress.predictDeterministicAddress(_salt, address(this));
    }
}
