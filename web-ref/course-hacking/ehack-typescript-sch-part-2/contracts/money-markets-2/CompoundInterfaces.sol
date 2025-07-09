// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface cERC20 is IERC20 {
    function mint(uint256) external returns (uint256);

    function borrow(uint borrowAmount) external returns (uint);

    function exchangeRateCurrent() external view returns (uint256);

    function repayBorrow(uint repayAmount) external returns (uint);

    function redeem(uint redeemTokens) external returns (uint);

    function redeemUnderlying(uint redeemAmount) external returns (uint);

    function underlying() external view returns (address);

    function balanceOfUnderlying(address owner) external view returns (uint);
}

interface IComptroller {
    function enterMarkets(
        address[] calldata cTokens
    ) external returns (uint[] memory);

    function getAccountLiquidity(
        address account
    ) external view returns (uint, uint, uint);
}
