// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/proxy/UUPSUpgradeableMock.sol";
import "../../../contracts/proxy/utils/UUPSUpgradeable.sol";
import "../../../contracts/interfaces/draft-IERC1822.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/Errors.sol";

contract $NonUpgradeableMock is NonUpgradeableMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_counter() external view returns (uint256) {
        return _counter;
    }

    receive() external payable {}
}

contract $UUPSUpgradeableMock is UUPSUpgradeableMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_counter() external view returns (uint256) {
        return _counter;
    }

    function $_authorizeUpgrade(address arg0) external {
        super._authorizeUpgrade(arg0);
    }

    function $_checkProxy() external view {
        super._checkProxy();
    }

    function $_checkNotDelegated() external view {
        super._checkNotDelegated();
    }

    receive() external payable {}
}

contract $UUPSUpgradeableUnsafeMock is UUPSUpgradeableUnsafeMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_counter() external view returns (uint256) {
        return _counter;
    }

    function $_authorizeUpgrade(address arg0) external {
        super._authorizeUpgrade(arg0);
    }

    function $_checkProxy() external view {
        super._checkProxy();
    }

    function $_checkNotDelegated() external view {
        super._checkNotDelegated();
    }

    receive() external payable {}
}

contract $UUPSUnsupportedProxiableUUID is UUPSUnsupportedProxiableUUID {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_counter() external view returns (uint256) {
        return _counter;
    }

    function $_authorizeUpgrade(address arg0) external {
        super._authorizeUpgrade(arg0);
    }

    function $_checkProxy() external view {
        super._checkProxy();
    }

    function $_checkNotDelegated() external view {
        super._checkNotDelegated();
    }

    receive() external payable {}
}
