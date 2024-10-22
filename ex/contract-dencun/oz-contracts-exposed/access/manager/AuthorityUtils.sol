// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/access/manager/AuthorityUtils.sol";
import "../../../contracts/access/manager/IAuthority.sol";

contract $AuthorityUtils {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $canCallWithDelay(address authority,address caller,address target,bytes4 selector) external view returns (bool immediate, uint32 delay) {
        (immediate, delay) = AuthorityUtils.canCallWithDelay(authority,caller,target,selector);
    }

    receive() external payable {}
}
