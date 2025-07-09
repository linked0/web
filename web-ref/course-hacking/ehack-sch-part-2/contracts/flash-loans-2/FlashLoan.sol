// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "../interfaces/ILendingPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

/**
 * @title FlashLoan
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract FlashLoan {

    ILendingPool pool;

    constructor(address _pool) {
        pool = ILendingPool(_pool);
    }

    function getFlashLoan(address token, uint amount) external {

        console.log("Balance before flash loan: ", IERC20(token).balanceOf(address(this)));

        address[] memory tokens = new address[](1);
        tokens[0] = token;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        pool.flashLoan(address(this), tokens, amounts, modes, address(this), "0x", 0);
    }

    function executeOperation(
        address[] memory assets,
        uint256[] memory amounts,
        uint256[] memory premiums,
        address initiator,
        bytes memory params
    ) public returns (bool) {

        require(msg.sender == address(pool), "not pool");
        require(initiator == address(this), "I didn't initiate this flash loan");

        IERC20 token;
        
        for(uint256 i = 0; i < assets.length; i++) {

            token = IERC20(assets[i]);


            console.log("contract's token balance during the flash loan: ", token.balanceOf(address(this)));

            // ~~ Flash Loan Assets ~~ ///
            // ~~ We can do whatever we wanted with the borrowed assets ~~ //
            console.log("Flash loan fee: ", premiums[i]);
            console.log("Flash loan amount: ", amounts[i]);

            uint256 owed = amounts[i] + premiums[i];
            token.approve(address(pool), owed);
        }

        return true;
    }
}