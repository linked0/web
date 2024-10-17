// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./IVoteraVote.sol";
import "./ICommonsBudget.sol";
import "./CommonsStorage.sol";

// The code about whether the fund can be withdrawn
// "W00" : The fund can be withdrawn
// "W01" : There's no proposal for the proposal ID
// "W02" : The proposal is not a fund proposal
// "W03" : The assessment failed
// "W04" : The vote counting is not yet complete
// "W05" : The requester of the funding is not the proposer
// "W06" : The proposal has come to invalid or been rejected
// "W07" : 24 hours has not passed after the voting finished
// "W08" : The withdrawal of the funds was refused
// "W09" : The funds is already withdrawn
// "W10" : The budget is less than the requested funds

contract CommonsBudget is Ownable, IERC165, ICommonsBudget {
    event Received(address, uint256);

    CommonsStorage storageContract;
    address public manager;

    mapping(bytes32 => ICommonsBudget.ProposalFeeData) internal feeMaps;

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    constructor() {
        storageContract = new CommonsStorage(msg.sender, address(this));
        manager = msg.sender;
    }

    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return
            interfaceId == this.supportsInterface.selector ||
            interfaceId ==
            this.isOwner.selector ^
                this.isManager.selector ^
                this.setManager.selector ^
                this.createSystemProposal.selector ^
                this.createFundProposal.selector ^
                this.assessProposal.selector ^
                this.finishVote.selector ^
                this.distributeVoteFees.selector ^
                this.checkWithdrawState.selector ^
                this.withdraw.selector;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "NotAuthorized");
        _;
    }

    modifier onlyInvalidProposal(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(proposalData.state == ICommonsBudget.ProposalStates.INVALID, "AlreadyExistProposal");
        _;
    }

    modifier onlyNotAssessedFundProposal(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(proposalData.state != ICommonsBudget.ProposalStates.INVALID, "NotFoundProposal");
        require(proposalData.proposalType == ICommonsBudget.ProposalType.FUND, "InvalidProposal");
        require(proposalData.state == ICommonsBudget.ProposalStates.CREATED, "AlreadyFinishedAssessment");
        require(block.timestamp >= proposalData.endAssess, "DuringAssessment");
        _;
    }

    modifier onlyNotFinishedProposal(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(proposalData.state != ICommonsBudget.ProposalStates.INVALID, "NotFoundProposal");
        require(proposalData.state != ICommonsBudget.ProposalStates.FINISHED, "AlreadyFinishedProposal");
        if (proposalData.proposalType == ICommonsBudget.ProposalType.FUND) {
            require(proposalData.state != ICommonsBudget.ProposalStates.REJECTED, "RejectedProposal");
            require(proposalData.state == ICommonsBudget.ProposalStates.ACCEPTED, "NoAssessment");
        } else {
            require(proposalData.state == ICommonsBudget.ProposalStates.CREATED, "InvalidState");
        }
        _;
    }

    modifier onlyApprovedFundProposal(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(proposalData.proposalType == ICommonsBudget.ProposalType.FUND, "InvalidProposal");
        require(proposalData.proposalResult == ICommonsBudget.ProposalResult.APPROVED, "NotApprovedProposal");
        _;
    }

    modifier onlyBeforeVoteStart(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(block.timestamp < proposalData.start, "TooLate");
        _;
    }

    modifier onlyVoteContract(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(msg.sender == proposalData.voteAddress, "NotAuthorized");
        _;
    }

    modifier onlyEndProposal(bytes32 _proposalID) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        require(block.timestamp >= proposalData.end, "NotEndProposal");
        _;
    }

    /// @notice check if an address is the owner of the contract
    /// @param account the address to be checked
    /// @return return `true` if the `account` is owner
    function isOwner(address account) external view override returns (bool) {
        return owner() == account;
    }

    /// @notice check if an address is the manager of the contract
    /// @param account the address to be checked
    /// @return return `true` if the `account` is the manager
    function isManager(address account) external view override returns (bool) {
        return (account == manager);
    }

    /// @notice transfer ownership of the contract to a new account (newOwner).
    ///     Can only be called by the current owner.
    /// @param newOwner the address of the new owner
    function transferOwnership(address newOwner) public override onlyOwner {
        _transferOwnership(newOwner);
        storageContract.transferOwnership(newOwner);
    }

    /// @notice change the manager of the contract to a new account
    /// @param newManager the address of the new manager
    function setManager(address newManager) external override onlyOwner {
        manager = newManager;
    }

    function getStorageContractAddress() external view returns (address contractAddress) {
        return address(storageContract);
    }

    function initVote(
        bytes32 _proposalID,
        ICommonsBudget.ProposalType _proposalType,
        uint64 _start,
        uint64 _end,
        uint64 _startAssess,
        uint64 _endAssess
    ) internal returns (address) {
        require(storageContract.voteAddress() != address(0) && storageContract.voteManager() != address(0), "NotReady");
        IVoteraVote(storageContract.voteAddress()).init(
            _proposalID,
            _proposalType == ICommonsBudget.ProposalType.FUND ? true : false,
            _start,
            _end,
            _startAssess,
            _endAssess
        );
        return storageContract.voteAddress();
    }

    /// @notice create system proposal
    /// @param _proposalID id of proposal
    /// @param _proposalInput input data of proposal
    /// @param _signature signature data from vote manager of proposal
    function createSystemProposal(
        bytes32 _proposalID,
        ProposalInput calldata _proposalInput,
        bytes calldata _signature
    ) external payable override onlyInvalidProposal(_proposalID) {
        require(msg.value >= storageContract.systemProposalFee(), "InvalidFee");
        storageContract.createSystemProposal(_proposalID, msg.sender, _proposalInput, _signature);
        initVote(
            _proposalID,
            ProposalType.SYSTEM,
            _proposalInput.start,
            _proposalInput.end,
            _proposalInput.startAssess,
            _proposalInput.endAssess
        );

        feeMaps[_proposalID].value = msg.value;
        feeMaps[_proposalID].payer = msg.sender;
    }

    /// @notice create fund proposal
    /// @param _proposalID id of proposal
    /// @param _proposalInput input data of proposal
    /// @param _signature signature data from vote manager of proposal
    function createFundProposal(
        bytes32 _proposalID,
        ProposalInput calldata _proposalInput,
        bytes calldata _signature
    ) external payable override onlyInvalidProposal(_proposalID) {
        uint256 _appropriateFee = (_proposalInput.amount * storageContract.fundProposalFeePermil()) / 1000;
        require(msg.value >= _appropriateFee, "InvalidFee");
        require(address(this).balance >= _proposalInput.amount, "NotEnoughBudget");
        storageContract.createFundProposal(_proposalID, msg.sender, _proposalInput, _signature);
        initVote(
            _proposalID,
            ProposalType.FUND,
            _proposalInput.start,
            _proposalInput.end,
            _proposalInput.startAssess,
            _proposalInput.endAssess
        );

        feeMaps[_proposalID].value = msg.value;
        feeMaps[_proposalID].payer = msg.sender;
    }

    /// @notice change votera vote system parameter
    /// @param _voteManager address of voteManager
    /// @param _voteAddress address of voteraVote contract
    function changeVoteParam(address _voteManager, address _voteAddress) public onlyOwner {
        storageContract.changeVoteParam(_voteManager, _voteAddress);
    }

    /// @notice save assess result of proposal
    /// @dev this is called by vote contract
    /// @param _proposalID id of proposal
    /// @param _validatorSize size of valid validator of proposal
    /// @param _assessParticipantSize size of assess participant
    /// @param _assessData result of assess
    function assessProposal(
        bytes32 _proposalID,
        uint256 _validatorSize,
        uint256 _assessParticipantSize,
        uint64[] calldata _assessData
    )
        external
        override
        onlyNotAssessedFundProposal(_proposalID)
        onlyBeforeVoteStart(_proposalID)
        onlyVoteContract(_proposalID)
    {
        bool assessResult = storageContract.assessProposal(
            _proposalID,
            _validatorSize,
            _assessParticipantSize,
            _assessData
        );
        emit AssessmentFinish(_proposalID, assessResult);
    }

    /// @notice notify that vote is finished
    /// @dev this is called by vote contract
    /// @param _proposalID id of proposal
    /// @param _validatorSize size of valid validator of proposal's vote
    /// @param _voteResult result of proposal's vote
    function finishVote(
        bytes32 _proposalID,
        uint256 _validatorSize,
        uint64[] calldata _voteResult
    )
        external
        override
        onlyNotFinishedProposal(_proposalID)
        onlyEndProposal(_proposalID)
        onlyVoteContract(_proposalID)
    {
        bool voteResult = storageContract.finishVote(_proposalID, _validatorSize, _voteResult);
        emit VoteCountingFinish(_proposalID, voteResult);
    }

    /// @notice check if the distribution is available
    /// @param _proposalID id of proposal
    function canDistributeVoteFees(bytes32 _proposalID) public view returns (bool) {
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        IVoteraVote voteraVote = IVoteraVote(proposalData.voteAddress);
        if (voteraVote.isValidatorListFinalized(_proposalID)) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice distribute the vote fees to validators
    /// @param _proposalID id of proposal
    /// @param _start the start index of validators that
    ///     is to receive a vote fee.
    function distributeVoteFees(bytes32 _proposalID, uint256 _start) external override onlyManager {
        require(canDistributeVoteFees(_proposalID));

        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        IVoteraVote voteraVote = IVoteraVote(proposalData.voteAddress);
        uint256 validatorLength = voteraVote.getValidatorCount(_proposalID);
        require(_start < validatorLength, "InvalidInput");
        for (uint256 i = _start; i < validatorLength && i < _start + storageContract.voteFeeDistribCount(); i++) {
            address validator = voteraVote.getValidatorAt(_proposalID, i);
            if (!feeMaps[_proposalID].voteFeePaid[validator]) {
                feeMaps[_proposalID].voteFeePaid[validator] = true;
                payable(validator).transfer(storageContract.voterFee());
            }
        }
    }

    /// @notice get fees to be paid for the proposal
    /// @param _proposalID id of proposal
    /// @return returns fee values to be paid for the proposal
    function getProposalValues(bytes32 _proposalID) public view returns (uint256) {
        return feeMaps[_proposalID].value;
    }

    /// @notice get proposal data
    /// @param _proposalID id of proposal
    /// @return returns proposal data
    function getProposalData(bytes32 _proposalID) public view returns (ProposalData memory) {
        return storageContract.getProposalData(_proposalID);
    }

    /// @notice refuse funding for the proposal
    /// @param _proposalID id of proposal
    function refuseFunding(bytes32 _proposalID) external override onlyOwner onlyApprovedFundProposal(_proposalID) {
        storageContract.setFundingAllowed(_proposalID, false);
        emit FundWithdrawRefuse(_proposalID);
    }

    /// @notice allow funding for the proposal
    /// @param _proposalID id of proposal
    function allowFunding(bytes32 _proposalID) external override onlyOwner onlyApprovedFundProposal(_proposalID) {
        storageContract.setFundingAllowed(_proposalID, true);
        emit FundWithdrawAllow(_proposalID);
    }

    /// @notice withdraw the funds of the proposal
    /// @param _proposalID id of proposal
    /// @return code the status code
    /// @return countingFinishTime the time of the vote counting
    function checkWithdrawState(bytes32 _proposalID)
        external
        view
        override
        returns (string memory code, uint256 countingFinishTime)
    {
        string memory stateCode = storageContract.checkWithdrawState(_proposalID, msg.sender);
        if (keccak256(bytes(stateCode)) == keccak256(bytes("W01"))) {
            return (stateCode, 0);
        }

        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        return (stateCode, proposalData.countingFinishTime);
    }

    /// @notice withdraw the funds of the proposal
    /// @param _proposalID id of proposal
    function withdraw(bytes32 _proposalID) external override {
        string memory stateCode = storageContract.checkWithdrawState(_proposalID, msg.sender);
        require(keccak256(bytes(stateCode)) == keccak256(bytes("W00")), stateCode);

        storageContract.setWithdrawn(_proposalID);
        ProposalData memory proposalData = storageContract.getProposalData(_proposalID);
        payable(msg.sender).transfer(proposalData.fundAmount);
        emit FundTransfer(_proposalID);
    }
}
