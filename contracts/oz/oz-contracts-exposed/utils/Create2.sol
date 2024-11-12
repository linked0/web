// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Create2.sol";
import "../../contracts/utils/Errors.sol";

contract $Create2 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$deploy(address addr);

    constructor() payable {
    }

    function $deploy(uint256 amount,bytes32 salt,bytes calldata bytecode) external payable returns (address addr) {
        (addr) = Create2.deploy(amount,salt,bytecode);
        emit return$deploy(addr);
    }

    function $computeAddress(bytes32 salt,bytes32 bytecodeHash) external view returns (address ret0) {
        (ret0) = Create2.computeAddress(salt,bytecodeHash);
    }

    function $computeAddress(bytes32 salt,bytes32 bytecodeHash,address deployer) external pure returns (address addr) {
        (addr) = Create2.computeAddress(salt,bytecodeHash,deployer);
    }

    receive() external payable {}
}
