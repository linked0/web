// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title RainbowAllianceToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract RainbowAllianceToken is ERC20, Ownable {

    uint public lastProposalId;

    mapping(address => uint) public getVotingPower;
    mapping(uint => Proposal) public getProposal;
    mapping(uint => mapping(address => bool)) public voted;

    struct Proposal {
        uint id;
        string description;
        uint yes;
        uint no;
    }
    constructor() ERC20("Rainbow Alliance", "RNB") {
        lastProposalId = 0;
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
        getVotingPower[_to] += _amount;
    }

    function burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
        getVotingPower[_from] -= _amount;
    }

    // @audit-issue Voting power is not trnasfered when someone is calling the built-in
    // ERC20 functions Trasnfer & TrasnferFrom

    function createProposal(string memory _description) external {

        require(getVotingPower[msg.sender] > 0, "no voting rights");
        require(bytes(_description).length != 0, "description is required");
        
        lastProposalId = lastProposalId + 1;

        getProposal[lastProposalId] = Proposal({
            id: lastProposalId,
            description: _description,
            yes: getVotingPower[msg.sender],
            no: 0
        });
 
        voted[lastProposalId][msg.sender] = true;
    }

    function vote(uint _id, bool _decision) external {

        require(getVotingPower[msg.sender] > 0, "no voting rights");
        require(!voted[_id][msg.sender], "already voted");
        Proposal storage proposal = getProposal[_id];

        require(_id > 0 && _id <= lastProposalId, "proposal doesn't exist");

        if(_decision) {
            proposal.yes += getVotingPower[msg.sender];
        } else { 
            proposal.no += getVotingPower[msg.sender];
        }
        
        getProposal[proposal.id] = proposal;
        voted[_id][msg.sender] = true;
    }
}

