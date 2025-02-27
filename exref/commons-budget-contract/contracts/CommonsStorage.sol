// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./ICommonsBudget.sol";
import "./ICommonsStorage.sol";
import "./IVoteraVote.sol";

contract CommonsStorage is ICommonsStorage {
    // The address of the owner that created the CommonsBudget contract
    address private owner;

    // The address of the CommonsBudget that created this contract
    address private commonsBudgetAddress;

    // It is a fee for the funding proposal. This is not a unit of BOA.
    // This is a thousand percent.
    // Proposal Fee = Funding amount * fundProposalFeePermil / 1000
    uint32 public fundProposalFeePermil;

    // It is a fee for system proposals. Its unit is cent of BOA.
    uint256 public systemProposalFee;

    // Factor required to calculate a valid quorum
    // Quorum = Number of validators * vote_quorum_permil / 1000000
    uint32 public voteQuorumFactor;

    // It is a fee to be paid for the validator that participates
    // in a voting, which is a voter. Its unit is cent of BOA.
    uint256 public voterFee;

    // The max count of validators that CommonsBudget can distribute
    // vote fess to in an attempt of distribution.
    uint256 public voteFeeDistribCount;

    // The difference for approval between the net percent of positive votes
    // and the net percentage of negative votes
    uint256 public constant approvalDiffPercent = 10;

    mapping(bytes32 => ICommonsBudget.ProposalData) internal proposalMaps;

    /// @notice vote manager is votera vote server
    /// @return returns address of vote manager
    address public voteManager;
    /// @notice vote address is votera vote contract
    /// @return returns address of vote contract
    address public voteAddress;

    constructor(address _owner, address _budgetAddress) {
        owner = _owner;
        commonsBudgetAddress = _budgetAddress;
        fundProposalFeePermil = 10;
        systemProposalFee = 100000000000000000000;
        voteQuorumFactor = 333333; // Number of validators / 3
        voterFee = 400000000000000;
        voteFeeDistribCount = 100;
    }

    /// @notice transfer ownership of the contract to a new account (newOwner).
    ///     Can only be called by the current owner.
    /// @param newOwner the address of the new owner
    function transferOwnership(address newOwner) public onlyCommonsBudget {
        owner = newOwner;
    }

    // Proposal Fee = Funding amount * _value / 1000
    function setFundProposalFeePermil(uint32 _value) external override onlyOwner {
        fundProposalFeePermil = _value;
    }

    // Its unit is cent of BOA.
    function setSystemProposalFee(uint256 _value) external override onlyOwner {
        systemProposalFee = _value;
    }

    // Proposal Fee = Number of validators * _value / 1000000
    function setVoteQuorumFactor(uint32 _value) external override onlyOwner {
        require(_value > 0 && _value < 1000000, "InvalidInput");
        voteQuorumFactor = _value;
    }

    function setVoterFee(uint256 _value) external override onlyOwner {
        voterFee = _value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NotAuthorized");
        _;
    }

    modifier onlyCommonsBudget() {
        require(msg.sender == commonsBudgetAddress, "NotAuthorized");
        _;
    }

    /// @notice change votera vote system parameter
    /// @param _voteManager address of voteManager
    /// @param _voteAddress address of voteraVote contract
    function changeVoteParam(address _voteManager, address _voteAddress) public onlyCommonsBudget {
        require(_voteManager != address(0) && _voteAddress != address(0), "InvalidInput");
        voteManager = _voteManager;
        voteAddress = _voteAddress;
    }

    function saveProposalData(
        ICommonsBudget.ProposalType _proposalType,
        bytes32 _proposalID,
        address proposer,
        ICommonsBudget.ProposalInput calldata _proposalInput
    ) private {
        proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.CREATED;
        proposalMaps[_proposalID].proposalType = _proposalType;
        if (_proposalType == ICommonsBudget.ProposalType.FUND) {
            proposalMaps[_proposalID].fundingAllowed = true;
        }
        proposalMaps[_proposalID].title = _proposalInput.title;
        proposalMaps[_proposalID].start = _proposalInput.start;
        proposalMaps[_proposalID].end = _proposalInput.end;
        proposalMaps[_proposalID].startAssess = _proposalInput.startAssess;
        proposalMaps[_proposalID].endAssess = _proposalInput.endAssess;
        proposalMaps[_proposalID].docHash = _proposalInput.docHash;
        proposalMaps[_proposalID].fundAmount = _proposalInput.amount;
        proposalMaps[_proposalID].proposer = proposer;
        proposalMaps[_proposalID].voteAddress = voteAddress;
    }

    /// @notice create system proposal
    /// @param _proposalID id of proposal
    /// @param _proposalInput input data of proposal
    /// @param _signature signature data from vote manager of proposal
    function createSystemProposal(
        bytes32 _proposalID,
        address proposer,
        ICommonsBudget.ProposalInput calldata _proposalInput,
        bytes calldata _signature
    ) external onlyCommonsBudget {
        require(block.timestamp < _proposalInput.start && _proposalInput.start < _proposalInput.end, "InvalidInput");
        bytes32 dataHash = keccak256(
            abi.encode(
                _proposalID,
                _proposalInput.title,
                _proposalInput.start,
                _proposalInput.end,
                _proposalInput.docHash
            )
        );
        require(ECDSA.recover(dataHash, _signature) == voteManager, "InvalidInput");

        saveProposalData(ICommonsBudget.ProposalType.SYSTEM, _proposalID, proposer, _proposalInput);
    }

    /// @notice create fund proposal
    /// @param _proposalID id of proposal
    /// @param _proposalInput input data of proposal
    /// @param _signature signature data from vote manager of proposal
    function createFundProposal(
        bytes32 _proposalID,
        address proposer,
        ICommonsBudget.ProposalInput calldata _proposalInput,
        bytes calldata _signature
    ) external onlyCommonsBudget {
        require(
            block.timestamp < _proposalInput.endAssess &&
                _proposalInput.startAssess < _proposalInput.endAssess &&
                _proposalInput.endAssess < _proposalInput.start &&
                _proposalInput.start < _proposalInput.end,
            "InvalidInput"
        );

        bytes32 dataHash = keccak256(
            abi.encode(
                _proposalID,
                _proposalInput.title,
                _proposalInput.start,
                _proposalInput.end,
                _proposalInput.startAssess,
                _proposalInput.endAssess,
                _proposalInput.docHash,
                _proposalInput.amount,
                proposer
            )
        );
        require(ECDSA.recover(dataHash, _signature) == voteManager, "InvalidInput");

        saveProposalData(ICommonsBudget.ProposalType.FUND, _proposalID, proposer, _proposalInput);
    }

    function getProposalData(bytes32 _proposalID) public view returns (ICommonsBudget.ProposalData memory) {
        return proposalMaps[_proposalID];
    }

    function assessProposal(
        bytes32 _proposalID,
        uint256 _validatorSize,
        uint256 _assessParticipantSize,
        uint64[] calldata _assessData
    ) external onlyCommonsBudget returns (bool) {
        proposalMaps[_proposalID].validatorSize = _validatorSize;
        proposalMaps[_proposalID].assessParticipantSize = _assessParticipantSize;
        proposalMaps[_proposalID].assessData = _assessData;

        if (_assessParticipantSize > 0) {
            uint256 minPass = 5 * _assessParticipantSize; // average 5 each
            uint256 sum = 0;
            for (uint256 j = 0; j < _assessData.length; j++) {
                if (_assessData[j] < minPass) {
                    proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.REJECTED;
                    return false;
                }
                sum += _assessData[j];
            }
            // check total average 7 above
            minPass = _assessData.length * 7 * _assessParticipantSize;
            if (sum < minPass) {
                proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.REJECTED;
                return false;
            }

            proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.ACCEPTED;
            return true;
        } else {
            proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.REJECTED;
            return false;
        }
    }

    function finishVote(
        bytes32 _proposalID,
        uint256 _validatorSize,
        uint64[] calldata _voteResult
    ) external onlyCommonsBudget returns (bool) {
        address _voteAddress = proposalMaps[_proposalID].voteAddress;
        IVoteraVote voteraVote = IVoteraVote(_voteAddress);
        require(voteManager == voteraVote.getManager(), "InvalidVote");
        require(_validatorSize == voteraVote.getValidatorCount(_proposalID), "InvalidInput");

        proposalMaps[_proposalID].countingFinishTime = block.timestamp;
        proposalMaps[_proposalID].state = ICommonsBudget.ProposalStates.FINISHED;
        proposalMaps[_proposalID].validatorSize = _validatorSize;
        proposalMaps[_proposalID].voteResult = _voteResult;

        uint64[] memory voteResult = voteraVote.getVoteResult(_proposalID);
        require(voteResult.length == _voteResult.length, "InvalidInput");
        uint256 voteCount = 0;
        for (uint256 i = 0; i < voteResult.length; i++) {
            require(voteResult[i] == _voteResult[i], "InvalidInput");
            voteCount += voteResult[i];
        }

        // Check if it has sufficient number of quorum member
        if (voteCount < (_validatorSize * voteQuorumFactor) / 1000000) {
            proposalMaps[_proposalID].proposalResult = ICommonsBudget.ProposalResult.INVALID_QUORUM;
        }
        // Check if it has sufficient number of positive votes
        else if (
            voteResult[1] <= voteResult[2] || ((voteResult[1] - voteResult[2]) * 100) / voteCount < approvalDiffPercent
        ) {
            proposalMaps[_proposalID].proposalResult = ICommonsBudget.ProposalResult.REJECTED;
        } else {
            proposalMaps[_proposalID].proposalResult = ICommonsBudget.ProposalResult.APPROVED;
        }

        if (proposalMaps[_proposalID].proposalResult == ICommonsBudget.ProposalResult.APPROVED) {
            return true;
        } else {
            return false;
        }
    }

    function setFundingAllowed(bytes32 _proposalID, bool allow) external onlyCommonsBudget {
        require(proposalMaps[_proposalID].fundWithdrawn == false, "W09");
        require(allow == true || block.timestamp - proposalMaps[_proposalID].countingFinishTime < 86400, "InvalidTime");

        proposalMaps[_proposalID].fundingAllowed = allow;
    }

    function checkWithdrawState(bytes32 _proposalID, address requestAddress)
        external
        view
        returns (string memory code)
    {
        string memory stateCode;
        ICommonsBudget.ProposalData memory _proposalData = proposalMaps[_proposalID];
        if (_proposalData.state == ICommonsBudget.ProposalStates.INVALID) {
            stateCode = "W01";
        } else if (_proposalData.proposalType == ICommonsBudget.ProposalType.SYSTEM) {
            stateCode = "W02";
        } else if (_proposalData.state == ICommonsBudget.ProposalStates.REJECTED) {
            stateCode = "W03";
        } else if (_proposalData.state < ICommonsBudget.ProposalStates.FINISHED) {
            stateCode = "W04";
        } else if (_proposalData.proposer != requestAddress) {
            stateCode = "W05";
        } else if (_proposalData.proposalResult != ICommonsBudget.ProposalResult.APPROVED) {
            stateCode = "W06";
        } else if (block.timestamp - _proposalData.countingFinishTime < 86400) {
            stateCode = "W07";
        } else if (_proposalData.fundingAllowed == false) {
            stateCode = "W08";
        } else if (_proposalData.fundWithdrawn == true) {
            stateCode = "W09";
        } else if (_proposalData.fundAmount > commonsBudgetAddress.balance) {
            stateCode = "W10";
        } else {
            stateCode = "W00";
        }

        return stateCode;
    }

    function setWithdrawn(bytes32 _proposalID) external onlyCommonsBudget {
        proposalMaps[_proposalID].fundWithdrawn = true;
    }
}
