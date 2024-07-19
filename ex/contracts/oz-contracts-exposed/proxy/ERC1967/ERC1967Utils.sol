// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/Errors.sol";

contract $ERC1967Utils {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $IMPLEMENTATION_SLOT() external pure returns (bytes32) {
        return ERC1967Utils.IMPLEMENTATION_SLOT;
    }

    function $ADMIN_SLOT() external pure returns (bytes32) {
        return ERC1967Utils.ADMIN_SLOT;
    }

    function $BEACON_SLOT() external pure returns (bytes32) {
        return ERC1967Utils.BEACON_SLOT;
    }

    function $getImplementation() external view returns (address ret0) {
        (ret0) = ERC1967Utils.getImplementation();
    }

    function $upgradeToAndCall(address newImplementation,bytes calldata data) external payable {
        ERC1967Utils.upgradeToAndCall(newImplementation,data);
    }

    function $getAdmin() external view returns (address ret0) {
        (ret0) = ERC1967Utils.getAdmin();
    }

    function $changeAdmin(address newAdmin) external payable {
        ERC1967Utils.changeAdmin(newAdmin);
    }

    function $getBeacon() external view returns (address ret0) {
        (ret0) = ERC1967Utils.getBeacon();
    }

    function $upgradeBeaconToAndCall(address newBeacon,bytes calldata data) external payable {
        ERC1967Utils.upgradeBeaconToAndCall(newBeacon,data);
    }

    receive() external payable {}
}
