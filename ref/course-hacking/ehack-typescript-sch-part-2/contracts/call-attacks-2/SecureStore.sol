// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SecureStore {
    address public rentingLibrary;
    address public owner;
    uint256 public pricePerDay;
    uint256 public rentedUntil;

    IERC20 public usdc;

    using SafeERC20 for IERC20;

    // renter address => timestamp (until when it's reserved)
    mapping(address => uint256) public renters;

    bytes4 constant setRenterIDFuncSig =
        bytes4(keccak256("setCurrentRenter(uint256)"));

    constructor(address _rentingLibrary, uint256 _price, address _usdc) {
        rentingLibrary = _rentingLibrary;
        owner = msg.sender;
        pricePerDay = _price;
        usdc = IERC20(_usdc);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyCurrentRenter() {
        require(renters[msg.sender] > block.timestamp, "Only current renter");
        _;
    }

    event RentedFor(uint256 numDays);

    function setRentPrice(uint256 _price) public onlyOwner {
        pricePerDay = _price;
    }

    function rentWarehouse(uint256 _numDays, uint256 _renterId) external {
        // Cannot be rented by multiple users at the same time
        require(block.timestamp >= rentedUntil, "Warehouse is already rented!");

        // Calculate payment amount
        uint256 requiredAmount = _numDays * pricePerDay;
        usdc.safeTransferFrom(msg.sender, address(this), requiredAmount);

        rentedUntil = block.timestamp + _numDays * 1 days;
        renters[msg.sender] = rentedUntil;

        (bool success, bytes memory data) = rentingLibrary.delegatecall(
            abi.encodePacked(setRenterIDFuncSig, _renterId)
        );
        require(success, "Setting renter failed");

        emit RentedFor(_numDays);
    }

    function terminateRental() external onlyCurrentRenter {
        uint256 remainingDays = (renters[msg.sender] - block.timestamp) /
            1 days;
        require(remainingDays > 0, "No open rent");

        uint256 refundAmount = remainingDays * pricePerDay;

        if (rentedUntil == renters[msg.sender]) {
            // change the rentedUntil so it will be free from this moment onwards
            rentedUntil = block.timestamp;
            // change until when the current renter rented the warehouse
            renters[msg.sender] = rentedUntil;
        } else {
            revert("error");
        }
        // TODO check if the transfer is completed
        usdc.safeTransfer(msg.sender, refundAmount);
    }

    function withdrawAll() public onlyOwner {
        uint256 balanceOfContract = usdc.balanceOf(address(this));
        usdc.safeTransfer(msg.sender, balanceOfContract);
    }
}
