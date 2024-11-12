// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

import {IUniswapV2Pair} from "../interfaces/IUniswapV2.sol";
import {IWETH9} from "../interfaces/IWETH9.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

/**
 * @title LendLand
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract LendLand {

    using SafeERC20 for IERC20;
    
    address public pair;
    address public token0;
    address public token1;

    // token -> user -> amount
    mapping(address => mapping (address => uint256)) public deposited; // Deposits
    mapping(address => mapping (address => uint256)) public debt; // Debts

    modifier isSupportedToken(address _token) {
        require(_token == token0 || _token == token1, "not supported token");
        _;
    }

    constructor (address _pair) {
        pair = _pair;
        token0 = IUniswapV2Pair(pair).token0();
        token1 = IUniswapV2Pair(pair).token1();
    }

    function deposit(address _token, uint256 _amount) public isSupportedToken(_token) {
        deposited[_token][msg.sender] += _amount;
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(address _token, uint256 _amount) public isSupportedToken(_token) {
        deposited[_token][msg.sender] -= _amount;
        address otherToken = _token == token0 ? token1 : token0;
        require(isSafeDebt(otherToken, msg.sender), "Not enough collateral");
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function borrow(address _token, uint256 _amount) public isSupportedToken(_token) {
        // Add wanted borrow amount before checking debt safety
        debt[_token][msg.sender] += _amount;
        require(isSafeDebt(_token, msg.sender), "Not enough collateral");
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    function repay(address _token, uint256 _amount) public isSupportedToken(_token) {
        debt[_token][msg.sender] -= _amount;
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    }

    // _token - which the user want's to take from the protocol
    // _user - the user's address
    function isSafeDebt(address _token, address _user) public view returns (bool) {

        // @audit-issue Dangerous way to fetch the price oracle, can be manipulated with big external liquidity
        (uint112 reserve0, uint112 reserve1,) = IUniswapV2Pair(pair).getReserves();
        uint256 collateral; // user's collateral

        if(_token == token0) { 
            collateral = deposited[token1][_user] * reserve0 / reserve1;
        } else {
            collateral = deposited[token0][_user] * reserve1 / reserve0;
        }

        uint256 allowance = collateral * 2 / 3; // 66% LTV (Loan To Value)

        console.log("allowance: ", allowance);
        return allowance >= debt[_token][_user];
    }
}