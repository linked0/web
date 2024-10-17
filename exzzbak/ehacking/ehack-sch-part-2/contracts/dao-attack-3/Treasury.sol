// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title Treasury
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Treasury {

    using Address for address payable;
    address public deployer;
    address public governance;

    event PaymentSent(address indexed receiver, uint256 amount);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Only governance");
        _;
    }

    modifier onlyDeployer() {
        require(msg.sender == deployer, "Only deployer");
        _;
    }

    constructor() {
        deployer = msg.sender;
    }

    function setGovernance(address _governanceAddress) external onlyDeployer {
        require(governance == address(0), "Governance already set");
        governance = _governanceAddress;
    }

    function sendPayment(address _receiver, uint _amount) external onlyGovernance {
        payable(_receiver).sendValue(_amount);
        emit PaymentSent(_receiver, _amount);
    }

    receive() external payable {}
}
