// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ITheGridTreasury {
    function sendPayment(address _receiver, uint _amount) external;
}

/**
 * @title TheGridDAO
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract TheGridDAO is ERC20, Ownable {
    struct Proposal {
        uint256 proposedAt;
        address proposer;
        address to; // Target Address
        uint256 amount; // msg.value
        uint256 yes;
        uint256 no;
        bool processed;
    }

    mapping(uint => Proposal) public getProposal;
    mapping(uint => mapping(address => bool)) internal alreadyVoted;

    uint256 private immutable VOTING_PERIOD = 1 days;

    uint256 public lastProposalId;
    ITheGridTreasury public treasury;

    constructor() ERC20("The Grid", "GRD") {
        lastProposalId = 1;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = ITheGridTreasury(_treasury);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function propose(
        address _receiver,
        uint256 _amount
    ) external returns (uint256) {
        uint256 proposerBalance = balanceOf(msg.sender);
        require(proposerBalance > 0, "You don't have voting power");

        uint256 proposalId = lastProposalId;

        Proposal storage proposal = getProposal[proposalId];
        proposal.proposedAt = block.timestamp;
        proposal.proposer = msg.sender;
        proposal.to = _receiver;
        proposal.amount = _amount;
        proposal.yes = proposerBalance;
        proposal.no = 0;
        proposal.processed = false;

        alreadyVoted[proposalId][msg.sender] = true;

        lastProposalId++;

        return proposalId;
    }

    function vote(uint _proposalId, bool _decision) external {
        require(
            !alreadyVoted[_proposalId][msg.sender],
            "Already voted on this proposal"
        );

        uint256 voterBalance = balanceOf(msg.sender);
        require(voterBalance > 0, "You don't have voting power");

        Proposal storage proposal = getProposal[_proposalId];

        // Some checks
        require(proposal.proposer != address(0), "Doesn't exist");
        require(!proposal.processed, "Already processed");

        // Add votes
        if (_decision) {
            proposal.yes += voterBalance;
        } else {
            proposal.no += voterBalance;
        }

        // Update voted
        alreadyVoted[_proposalId][msg.sender] = true;
    }

    function execute(uint _id) external {
        Proposal storage proposal = getProposal[_id];
        require(proposal.proposer != address(0), "Doesn't exist");
        require(
            block.timestamp >= proposal.proposedAt + VOTING_PERIOD,
            "Voting is not over"
        );
        require(!proposal.processed, "Proposal already processed");

        if (proposal.yes > proposal.no) {
            treasury.sendPayment(proposal.to, proposal.amount);
        }

        proposal.processed = true;
    }
}
