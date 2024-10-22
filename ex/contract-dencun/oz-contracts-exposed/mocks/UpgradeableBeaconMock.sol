// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/UpgradeableBeaconMock.sol";
import "../../contracts/proxy/beacon/IBeacon.sol";

contract $UpgradeableBeaconMock is UpgradeableBeaconMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address impl) UpgradeableBeaconMock(impl) payable {
    }

    receive() external payable {}
}

contract $UpgradeableBeaconReentrantMock is UpgradeableBeaconReentrantMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
