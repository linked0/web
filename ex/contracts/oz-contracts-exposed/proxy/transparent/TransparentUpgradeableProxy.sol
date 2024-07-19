// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../../../contracts/proxy/Proxy.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/proxy/transparent/ProxyAdmin.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/access/Ownable.sol";
import "../../../contracts/utils/Errors.sol";
import "../../../contracts/utils/Context.sol";

contract $TransparentUpgradeableProxy is TransparentUpgradeableProxy {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address _logic, address initialOwner, bytes memory _data) TransparentUpgradeableProxy(_logic, initialOwner, _data) payable {
    }

    function $_proxyAdmin() external view returns (address ret0) {
        (ret0) = super._proxyAdmin();
    }

    function $_fallback() external {
        super._fallback();
    }

    function $_implementation() external view returns (address ret0) {
        (ret0) = super._implementation();
    }

    function $_delegate(address implementation) external {
        super._delegate(implementation);
    }

    receive() external payable {}
}
