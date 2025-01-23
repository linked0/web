// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title StableSwapSecured
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract StableSwapSecured is ReentrancyGuard, Ownable {

    using SafeERC20 for IERC20;

    address[] supportedTokens;

    constructor(address[] memory tokens) {
        for(uint i = 0; i < tokens.length; i++) {
            supportedTokens.push(tokens[i]);
        }
    }

    function swap(address fromToken, address toToken, uint amount) external nonReentrant {   

        require(isSupported(fromToken, toToken), "one of the tokens (or both) are not supported");
        require(amount > 0, "amount should be bigger then 0");

        // Check liquidity
        uint balance = IERC20(toToken).balanceOf(address(this));
        require(balance >= amount, "Not enough liquidity");

        // Transfer
        IERC20(fromToken).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(toToken).safeTransfer(msg.sender, amount);
    }

    function isSupported(address fromToken, address toToken) public view returns (bool) {

        bool fromSupported = false;
        bool toSupported = false;

        for(uint i = 0; i < supportedTokens.length; i++) {
            if (fromToken == supportedTokens[i]) {
                fromSupported = true;
            }
            if (toToken == supportedTokens[i]) {
                toSupported = true;
            }
        }

        if(fromSupported && toSupported) {
            return true;
        }

        return false;
    }
    
    function emergencyWithdraw(address _token, uint amount) external onlyOwner {
        IERC20(_token).safeTransfer(msg.sender, amount);
    }
}
