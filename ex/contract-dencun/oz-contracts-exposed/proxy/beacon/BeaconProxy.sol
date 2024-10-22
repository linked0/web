// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/beacon/BeaconProxy.sol";
import "../../../contracts/proxy/Proxy.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/Errors.sol";

contract $BeaconProxy is BeaconProxy {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address beacon, bytes memory data) BeaconProxy(beacon, data) payable {
    }

    function $_implementation() external view returns (address ret0) {
        (ret0) = super._implementation();
    }

    function $_getBeacon() external view returns (address ret0) {
        (ret0) = super._getBeacon();
    }

    function $_delegate(address implementation) external {
        super._delegate(implementation);
    }

    function $_fallback() external {
        super._fallback();
    }

    receive() external payable {}
}
