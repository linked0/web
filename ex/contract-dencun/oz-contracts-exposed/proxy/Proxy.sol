// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/proxy/Proxy.sol";

abstract contract $Proxy is Proxy {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_delegate(address implementation) external {
        super._delegate(implementation);
    }

    function $_fallback() external {
        super._fallback();
    }

    receive() external payable {}
}
