// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {AccountStorageInitializable} from "@erc6900/account/AccountStorageInitializable.sol";

contract MockDiamondStorageContract is AccountStorageInitializable {
    constructor() {
        _disableInitializers();
    }

    // solhint-disable-next-line no-empty-blocks
    function initialize() external initializer {}
}
