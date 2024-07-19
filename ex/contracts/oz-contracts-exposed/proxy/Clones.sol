// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/proxy/Clones.sol";
import "../../contracts/utils/Errors.sol";

contract $Clones {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$clone_address(address instance);

    event return$clone_address_uint256(address instance);

    event return$cloneDeterministic_address_bytes32(address instance);

    event return$cloneDeterministic_address_bytes32_uint256(address instance);

    constructor() payable {
    }

    function $clone(address implementation) external payable returns (address instance) {
        (instance) = Clones.clone(implementation);
        emit return$clone_address(instance);
    }

    function $clone(address implementation,uint256 value) external payable returns (address instance) {
        (instance) = Clones.clone(implementation,value);
        emit return$clone_address_uint256(instance);
    }

    function $cloneDeterministic(address implementation,bytes32 salt) external payable returns (address instance) {
        (instance) = Clones.cloneDeterministic(implementation,salt);
        emit return$cloneDeterministic_address_bytes32(instance);
    }

    function $cloneDeterministic(address implementation,bytes32 salt,uint256 value) external payable returns (address instance) {
        (instance) = Clones.cloneDeterministic(implementation,salt,value);
        emit return$cloneDeterministic_address_bytes32_uint256(instance);
    }

    function $predictDeterministicAddress(address implementation,bytes32 salt,address deployer) external pure returns (address predicted) {
        (predicted) = Clones.predictDeterministicAddress(implementation,salt,deployer);
    }

    function $predictDeterministicAddress(address implementation,bytes32 salt) external view returns (address predicted) {
        (predicted) = Clones.predictDeterministicAddress(implementation,salt);
    }

    receive() external payable {}
}
