// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/SingleInheritanceInitializableMocks.sol";
import "../../contracts/proxy/utils/Initializable.sol";

contract $MigratableMockV1 is MigratableMockV1 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $MigratableMockV2 is MigratableMockV2 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_migratedV2() external view returns (bool) {
        return _migratedV2;
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $MigratableMockV3 is MigratableMockV3 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_migratedV3() external view returns (bool) {
        return _migratedV3;
    }

    function $_migratedV2() external view returns (bool) {
        return _migratedV2;
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}
