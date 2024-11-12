// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/TimelockReentrant.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

contract $TimelockReentrant is TimelockReentrant {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_reentered() external view returns (bool) {
        return _reentered;
    }

    receive() external payable {}
}
