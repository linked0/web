// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/utils/UUPSUpgradeable.sol";
import "../../../contracts/interfaces/draft-IERC1822.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/Errors.sol";

abstract contract $UUPSUpgradeable is UUPSUpgradeable {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_checkProxy() external view {
        super._checkProxy();
    }

    function $_checkNotDelegated() external view {
        super._checkNotDelegated();
    }

    receive() external payable {}
}
