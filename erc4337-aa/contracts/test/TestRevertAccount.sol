// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.12;
/* solhint-disable no-inline-assembly */

import "../samples/SimpleAccount.sol";
contract TestRevertAccount is IAccount {
    IEntryPoint private ep;
    constructor(IEntryPoint _ep) payable {
        ep = _ep;
    }

    function validateUserOp(PackedUserOperation calldata, bytes32, uint256 missingAccountFunds)
    external override returns (uint256 validationData) {
        ep.depositTo{value : missingAccountFunds}(address(this));
        return 0;
    }

    function revertLong(uint256 length) public pure{
        assembly {
            let size := 10

            // set the "revertLong" string to the memory
            let ptr := mload(0x40)
            mstore(0x40, add(ptr, add(size, 0x20)))
            mstore(ptr, size)
            mstore(add(ptr, 0x20), "jay revert")
            revert(ptr, length)
        }
    }
}
