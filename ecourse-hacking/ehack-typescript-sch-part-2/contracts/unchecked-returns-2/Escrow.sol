// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEscrowNFT is IERC721 {
    function tokenDetails(uint256) external view returns (uint256, uint256);
}

/**
 * @title Escrow
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Escrow is Ownable {
    event Deposited(
        address from,
        address recipient,
        uint256 amount,
        uint256 duration
    );
    event Redeemed(
        address from,
        address recipient,
        uint256 amount,
        uint256 duration
    );

    address public escrowNFT;

    constructor(address _escrowNftAddress) {
        escrowNFT = _escrowNftAddress;
    }

    function escrowEth(address _recipient, uint256 _duration) external payable {
        require(_recipient != address(0), "Cannot escrow to zero address.");
        require(msg.value > 0, "Cannot escrow 0 ETH.");

        uint256 amount = msg.value;
        uint256 matureTime = block.timestamp + _duration;

        escrowNFT.call(
            abi.encodeWithSignature(
                "mint(address,uint256,uint256)",
                _recipient,
                amount,
                matureTime
            )
        );

        emit Deposited(msg.sender, _recipient, amount, matureTime);
    }

    function redeemEthFromEscrow(uint256 _tokenId) external {
        require(
            IEscrowNFT(escrowNFT).ownerOf(_tokenId) == msg.sender,
            "Must own token to claim underlying ETH"
        );

        (uint256 amount, uint256 matureTime) = IEscrowNFT(escrowNFT)
            .tokenDetails(_tokenId);
        require(matureTime <= block.timestamp, "Escrow period not expired.");

        escrowNFT.call(abi.encodeWithSignature("burn(uint256)", _tokenId));

        payable(msg.sender).call{value: amount}("");

        emit Redeemed(msg.sender, msg.sender, amount, matureTime);
    }
}
