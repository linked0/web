// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TokenSale
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TokenSale is ERC20("BestToken", "BST"), Ownable {
    mapping(address => uint[]) invested;
    address[] investors;

    event DistributedTokens(address to, uint amount);

    function invest() public payable {
        investors.push(msg.sender);
        invested[msg.sender].push(msg.value * 5);
    }

    function distributeTokens() public onlyOwner {
        for (uint i = 0; i < investors.length; i++) {
            address currentInvestor = investors[i];
            uint[] memory userInvestments = invested[currentInvestor];

            // investor => [0.0000001, 0.00000001, .....]
            for (uint k = 0; k < userInvestments.length; k++) {
                _mint(currentInvestor, userInvestments[k]);
                emit DistributedTokens(currentInvestor, userInvestments[k]);
            }
        }
    }

    function withdrawETH() public onlyOwner {
        bool sent = payable(msg.sender).send(address(this).balance);
        require(sent, "Failed to send Ether");
    }

    function claimable(
        address account,
        uint investmentID
    ) public view returns (uint) {
        return invested[account][investmentID];
    }
}
