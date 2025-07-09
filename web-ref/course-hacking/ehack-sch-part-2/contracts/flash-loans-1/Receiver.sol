// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

interface IPool {
    function flashLoan(uint256 amount) external;
}

/**
 * @title Receiver
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Receiver {

    IPool pool;

    constructor(address _poolAddress) {
        pool = IPool(_poolAddress);
    }

    // TODO: Implement Receiver logic (Receiving a loan and paying it back)

    // TODO: Complete this function
    function flashLoan(uint256 amount) external {
        pool.flashLoan(amount);
    }

    // TODO: Complete this function
    function getETH() external payable {
        (bool success, ) = msg.sender.call{value: msg.value}("");
        require(success, "failed to send ETH");
    }

}