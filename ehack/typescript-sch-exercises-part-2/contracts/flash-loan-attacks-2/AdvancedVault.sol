// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";

interface IFlashLoanEtherReceiver {
    function callBack() external payable;
}

/**
 * @title AdvancedVault
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AdvancedVault {
    using Address for address payable;
    mapping(address => uint256) private balances;

    constructor() payable {}

    function depositETH() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdrawETH() external {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).sendValue(amount);
    }

    function flashLoanETH(uint256 amount) external {
        uint256 balanceBefore = address(this).balance;
        require(
            balanceBefore >= amount,
            "Requested amount is greater than Vault balance"
        );
        IFlashLoanEtherReceiver(msg.sender).callBack{value: amount}();
        require(
            address(this).balance >= balanceBefore,
            "Need to pay back the loan"
        );
    }
}
