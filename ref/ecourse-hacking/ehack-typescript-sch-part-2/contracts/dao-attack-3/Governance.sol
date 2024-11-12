// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";

interface ITreasury {
    function sendPayment(address receiver, uint amount) external;
}

interface IDAOToken {
    function balanceOf(address account) external returns (uint);

    function totalSupply() external returns (uint);

    function snapshot() external returns (uint256 lastSnapshotId);

    function getBalanceAtSnapshot(
        address account,
        uint256 snapshotID
    ) external view returns (uint256);

    function getTotalSupplyAtSnapshot(
        uint256 snapshotID
    ) external view returns (uint256);
}

/**
 * @title Governance
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract Governance {
    using Address for address;

    struct Investment {
        uint256 proposedAt;
        uint256 snapshotID;
        address startup;
        uint256 amount;
        uint256 votes;
        bool processed;
    }

    uint256 private immutable VOTING_PERIOD = 3 days;

    IDAOToken public token;
    ITreasury public treasury;

    mapping(uint256 => Investment) public investments;

    // Payment ID => Voter => Voted?
    mapping(uint256 => mapping(address => bool)) public voted;
    uint256 private investmentsCounter;

    event InvestmentWasSuggested(
        uint256 investmentId,
        address indexed proposer
    );
    event InvestmentExecuted(uint256 investmentId, address indexed executer);
    event InvestmentRejected(uint256 investmentId, address indexed executer);

    modifier isAllowed(address account) {
        uint256 balance = token.balanceOf(account);
        require(balance > 0, "can't participate");
        _;
    }

    constructor(address _tokenAddress, address _treasuryAddress) {
        require(_tokenAddress != address(0), "zero address not allowed");
        require(_treasuryAddress != address(0), "zero address not allowed");
        token = IDAOToken(_tokenAddress);
        treasury = ITreasury(_treasuryAddress);
        investmentsCounter = 1;
    }

    function suggestInvestment(
        address _startup,
        uint256 _amount
    ) external isAllowed(msg.sender) returns (uint256) {
        require(
            _startup != address(this) || _startup != address(0),
            "Wrong receiver"
        );

        uint256 investmentId = investmentsCounter;
        uint256 snapshotID = token.snapshot();

        Investment storage investmentToQueue = investments[investmentId];
        investmentToQueue.proposedAt = block.timestamp;
        investmentToQueue.snapshotID = snapshotID;
        investmentToQueue.startup = _startup;
        investmentToQueue.amount = _amount;
        investmentToQueue.votes = token.getBalanceAtSnapshot(
            msg.sender,
            snapshotID
        );
        investmentToQueue.processed = false;

        // Mark voted for the one who suggested this investment
        voted[investmentId][msg.sender] = true;

        investmentsCounter++;

        emit InvestmentWasSuggested(investmentId, msg.sender);
        return investmentId;
    }

    function voteForInvestment(uint investmentId) external {
        Investment storage investment = investments[investmentId];

        require(investment.startup != address(0), "Investment does not exist");
        require(!investment.processed, "Investment already processed");
        require(!voted[investmentId][msg.sender], "Already voted");

        voted[investmentId][msg.sender] = true;
        investment.votes += token.getBalanceAtSnapshot(
            msg.sender,
            investment.snapshotID
        );
    }

    function executeInvestment(uint256 investmentId) external {
        Investment storage investment = investments[investmentId];

        // Checks
        require(investment.startup != address(0), "Investment does not exist");
        require(!investment.processed, "Investment already processed");

        uint quarterTotalSupply = token.getTotalSupplyAtSnapshot(
            investment.snapshotID
        ) / 4;

        // Enough votes
        if (investment.votes > quarterTotalSupply) {
            investment.processed = true;
            treasury.sendPayment(investment.startup, investment.amount);
            emit InvestmentExecuted(investmentId, msg.sender);
        } else {
            // Voting time is over, didn't get enough votes
            if (block.timestamp >= investment.proposedAt + VOTING_PERIOD) {
                investment.processed = true;
                emit InvestmentRejected(investmentId, msg.sender);
            } else {
                revert("Not enough votes, voting is not over");
            }
        }
    }
}
