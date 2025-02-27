//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./ICommonsBudget.sol";
import "./IVoteraVote.sol";

// E000 : authorization error
// E001 : invalid input error
// E002 : state error
// E003 : Too Late
// E004 : Too Early
// E005 : invalid signature

contract VoteraVote is Ownable, IVoteraVote {
    enum VoteState {
        INVALID,
        CREATED,
        SETTING,
        ASSESSING,
        RUNNING,
        FINISHED
    }

    uint256 public constant ASSESS_ITEM_SIZE = 5;

    /// @notice save vote information
    /// validator can submit ballot between startVote and endAvote
    /// if useAssess is true, pre-eveluation begeins at startAssess
    /// and validator can submit assessment result until endAssess.
    /// voteStart is after more than 3 days after endAssess
    /// openVote is about one or two block times after endVote
    /// vote manager starts revealing ballot after openVote
    /// info is additional information url for proposal
    struct VoteInfo {
        VoteState state;
        bool useAssess;
        address commonsBudgetAddress;
        uint64 startAssess;
        uint64 endAssess;
        uint64 startVote;
        uint64 endVote;
        uint64 openVote;
        string info;
        uint64[] voteResult;
        uint64[] assessData;
    }

    struct ValidatorMap {
        address[] keys;
        mapping(address => bool) values;
    }

    enum Candidate {
        BLANK,
        YES,
        NO
    }

    struct Ballot {
        address key;
        Candidate choice;
        uint256 nonce;
        bytes32 commitment;
    }
    struct BallotMap {
        address[] keys;
        mapping(address => Ballot) values;
        uint256 revealCount;
        address[] assessKeys;
        mapping(address => uint64[]) assessValues;
    }

    address public commonsBudgetAddress;

    mapping(bytes32 => VoteInfo) public voteInfos;
    mapping(bytes32 => ValidatorMap) private validators;
    mapping(bytes32 => BallotMap) private ballots;

    event VoteResultPublished(bytes32 _proposalID);

    /// @notice change common budget contract address
    /// @param _commonsBudgetAddress address of common budget contract
    function changeCommonBudgetContract(address _commonsBudgetAddress) public onlyOwner {
        require(_commonsBudgetAddress != address(0), "E001");
        commonsBudgetAddress = _commonsBudgetAddress;
    }

    /// @notice get address of manager of vote
    /// @return returns address of vote manager
    function getManager() external view override returns (address) {
        return owner();
    }

    /// @notice initialize vote
    /// @dev this is called by commons budget contract
    /// @param _proposalID id of proposal
    /// @param _useAssess true if assessment process is necessary or not
    /// @param _startVote vote starting time (seconds since the epoch)
    /// @param _endVote vote ending time (seconds since the epoch)
    /// @param _startAssess assess starting time (seconds since the epoch)
    /// @param _endAssess assess ending time (seconds since the epoch)
    function init(
        bytes32 _proposalID,
        bool _useAssess,
        uint64 _startVote,
        uint64 _endVote,
        uint64 _startAssess,
        uint64 _endAssess
    ) external override {
        require(msg.sender == commonsBudgetAddress, "E000");
        require(
            voteInfos[_proposalID].state == VoteState.INVALID &&
                voteInfos[_proposalID].commonsBudgetAddress == address(0),
            "E001"
        );
        require(block.timestamp < _startVote && _startVote < _endVote, "E001");
        if (_useAssess) {
            require(block.timestamp < _endAssess && _startAssess < _endAssess && _endAssess < _startVote, "E001");
        }

        voteInfos[_proposalID].state = VoteState.CREATED;
        voteInfos[_proposalID].useAssess = _useAssess;
        voteInfos[_proposalID].commonsBudgetAddress = commonsBudgetAddress;
        voteInfos[_proposalID].startVote = _startVote;
        voteInfos[_proposalID].endVote = _endVote;
        voteInfos[_proposalID].startAssess = _startAssess;
        voteInfos[_proposalID].endAssess = _endAssess;
    }

    function onlyVoteWithState(bytes32 _proposalID, VoteState state) private view {
        require(voteInfos[_proposalID].state != VoteState.INVALID, "E001");
        require(voteInfos[_proposalID].state == state, "E002");
    }

    /// @notice set additional vote information
    /// @param _proposalID id of proposal
    /// @param _startVote vote starting time (seconds since the epoch)
    /// @param _endVote vote ending time (seconds since the epoch)
    /// @param _openVote vote opening time (seconds since the epoch)
    /// @param _info additional information url for this vote
    function setupVoteInfo(
        bytes32 _proposalID,
        uint64 _startVote,
        uint64 _endVote,
        uint64 _openVote,
        string memory _info
    ) public onlyOwner {
        onlyVoteWithState(_proposalID, VoteState.CREATED);
        require(block.timestamp < _startVote, "E001");
        require(voteInfos[_proposalID].startVote == _startVote && voteInfos[_proposalID].endVote == _endVote, "E002");
        require(_endVote < _openVote, "E001");

        voteInfos[_proposalID].state = VoteState.SETTING;
        voteInfos[_proposalID].openVote = _openVote;
        voteInfos[_proposalID].info = _info;
    }

    /// @notice check whether registered validator of proposal
    /// @param _proposalID id of proposal
    /// @param _address check address
    /// @return returns true if address is validator or false
    function isContainValidator(bytes32 _proposalID, address _address) public view returns (bool) {
        return validators[_proposalID].values[_address];
    }

    /// @notice add validator
    /// @param _proposalID id of proposal
    /// @param _validators address of validators
    /// @param _finalized is last validator or not
    function addValidators(
        bytes32 _proposalID,
        address[] calldata _validators,
        bool _finalized
    ) external onlyOwner {
        onlyVoteWithState(_proposalID, VoteState.SETTING);
        require(block.timestamp < voteInfos[_proposalID].startVote, "E003");

        uint256 len = _validators.length;
        for (uint256 i = 0; i < len; ++i) {
            address _validator = _validators[i];
            if (!isContainValidator(_proposalID, _validator)) {
                validators[_proposalID].values[_validator] = true;
                validators[_proposalID].keys.push(_validator);
            }
        }

        if (_finalized) {
            voteInfos[_proposalID].state = voteInfos[_proposalID].useAssess ? VoteState.ASSESSING : VoteState.RUNNING;
        }
    }

    /// @notice get count of validator
    /// @param _proposalID id of proposal
    /// @return returns the count of proposal
    function getValidatorCount(bytes32 _proposalID) external view override returns (uint256) {
        return validators[_proposalID].keys.length;
    }

    /// @notice get validator at index
    /// @param _proposalID id of proposal
    /// @param _index index
    /// @return returns the validator address at that index
    function getValidatorAt(bytes32 _proposalID, uint256 _index) external view override returns (address) {
        return validators[_proposalID].keys[_index];
    }

    /// @notice get validator list is finalized or not
    /// @return returns true if finalized or false
    function isValidatorListFinalized(bytes32 _proposalID) external view override returns (bool) {
        return
            voteInfos[_proposalID].state != VoteState.INVALID &&
            voteInfos[_proposalID].state != VoteState.CREATED &&
            voteInfos[_proposalID].state != VoteState.SETTING;
    }

    /// @notice check whether assessment is exist or not
    /// @param _proposalId id of proposal
    /// @param _address address of validator
    /// @return returns true if found assessment, or false
    function isContainAssess(bytes32 _proposalId, address _address) public view returns (bool) {
        return ballots[_proposalId].assessValues[_address].length != 0;
    }

    /// @notice submit assessment
    /// @param _proposalID id of proposal
    /// @param _assess assessment result
    function submitAssess(bytes32 _proposalID, uint64[] calldata _assess) public {
        onlyVoteWithState(_proposalID, VoteState.ASSESSING);
        require(voteInfos[_proposalID].useAssess, "E001");
        require(isContainValidator(_proposalID, msg.sender), "E000");
        require(block.timestamp < voteInfos[_proposalID].endAssess, "E003");
        require(_assess.length == ASSESS_ITEM_SIZE, "E001");
        for (uint256 i = 0; i < _assess.length; i++) {
            require(_assess[i] >= 1 && _assess[i] <= 10, "E001");
        }

        if (isContainAssess(_proposalID, msg.sender)) {
            ballots[_proposalID].assessValues[msg.sender] = _assess;
        } else {
            ballots[_proposalID].assessValues[msg.sender] = _assess;
            ballots[_proposalID].assessKeys.push(msg.sender);
        }
    }

    /// @notice get count of assessment
    /// @param _proposalID id of proposal
    /// @return returns the count of assessment
    function getAssessCount(bytes32 _proposalID) public view returns (uint256) {
        return ballots[_proposalID].assessKeys.length;
    }

    /// @notice get assessment address
    /// @param _proposalID id of proposal
    /// @param _index index
    /// @return returns the address of assessment of that index
    function getAssessAt(bytes32 _proposalID, uint256 _index) public view returns (address) {
        return ballots[_proposalID].assessKeys[_index];
    }

    /// @notice count assessment result
    /// @param _proposalID id of proposal
    function countAssess(bytes32 _proposalID) public onlyOwner {
        onlyVoteWithState(_proposalID, VoteState.ASSESSING);
        require(voteInfos[_proposalID].useAssess, "E001");
        require(block.timestamp >= voteInfos[_proposalID].endAssess, "E004");

        uint64[] memory assessData = new uint64[](ASSESS_ITEM_SIZE);
        uint256 participantSize = ballots[_proposalID].assessKeys.length;
        for (uint256 i = 0; i < participantSize; i++) {
            address participantAddress = ballots[_proposalID].assessKeys[i];
            for (uint256 j = 0; j < ASSESS_ITEM_SIZE; j++) {
                assessData[j] += ballots[_proposalID].assessValues[participantAddress][j];
            }
        }

        voteInfos[_proposalID].state = VoteState.RUNNING;
        voteInfos[_proposalID].assessData = assessData;

        ICommonsBudget(voteInfos[_proposalID].commonsBudgetAddress).assessProposal(
            _proposalID,
            validators[_proposalID].keys.length,
            participantSize,
            assessData
        );
    }

    /// @notice get assess result
    /// @param _proposalID id of proposal
    /// @return returns the result of assessment
    function getAssessResult(bytes32 _proposalID) public view returns (uint64[] memory) {
        require(voteInfos[_proposalID].state != VoteState.INVALID, "E001");
        require(
            voteInfos[_proposalID].state == VoteState.RUNNING || voteInfos[_proposalID].state == VoteState.FINISHED,
            "E002"
        );
        return voteInfos[_proposalID].assessData;
    }

    function verifyBallot(
        bytes32 _proposalID,
        address _sender,
        bytes32 _commitment,
        bytes calldata _signature
    ) private view {
        bytes32 dataHash = keccak256(abi.encode(_proposalID, _sender, _commitment));
        require(ECDSA.recover(dataHash, _signature) == owner(), "E001");
    }

    /// @notice check whether ballot is exist or not
    /// @param _proposalID id of proposal
    /// @param _address address of validator
    /// @return returns true if found ballot, or false
    function isContainBallot(bytes32 _proposalID, address _address) public view returns (bool) {
        return ballots[_proposalID].values[_address].key == _address;
    }

    /// @notice submit ballot
    /// @param _proposalID id of proposal
    /// @param _commitment commitment of ballot
    /// @param _signature signature of commitment by vote manager
    function submitBallot(
        bytes32 _proposalID,
        bytes32 _commitment,
        bytes calldata _signature
    ) external override {
        onlyVoteWithState(_proposalID, VoteState.RUNNING);
        require(isContainValidator(_proposalID, msg.sender), "E000");
        require(block.timestamp >= voteInfos[_proposalID].startVote, "E004");
        require(block.timestamp < voteInfos[_proposalID].endVote, "E003");
        verifyBallot(_proposalID, msg.sender, _commitment, _signature);

        if (isContainBallot(_proposalID, msg.sender)) {
            ballots[_proposalID].values[msg.sender].commitment = _commitment;
        } else {
            ballots[_proposalID].values[msg.sender] = Ballot({
                key: msg.sender,
                commitment: _commitment,
                choice: Candidate.BLANK,
                nonce: 0
            });
            ballots[_proposalID].keys.push(msg.sender);
        }
    }

    /// @notice get count of ballot
    /// @param _proposalID id of proposal
    /// @return returns the count of ballot of vote
    function getBallotCount(bytes32 _proposalID) public view returns (uint256) {
        return ballots[_proposalID].keys.length;
    }

    /// @notice get ballot of validator
    /// @param _proposalID id of proposal
    /// @param _validator address of validator
    /// @return returns the ballot of validator
    function getBallot(bytes32 _proposalID, address _validator) public view returns (Ballot memory) {
        require(voteInfos[_proposalID].state != VoteState.INVALID, "E001");
        require(block.timestamp >= voteInfos[_proposalID].endVote, "E004");
        return ballots[_proposalID].values[_validator];
    }

    /// @notice get ballot address at that index
    /// @param _proposalID id of proposal
    /// @param _index index
    /// @return returns the ballot address at that index
    function getBallotAt(bytes32 _proposalID, uint256 _index) public view returns (address) {
        return ballots[_proposalID].keys[_index];
    }

    /// @notice submit revealed ballot after end of vote
    /// @param _proposalID id of proposal
    /// @param _validators array of address of validators
    /// @param _choices array of vote choice of validator
    /// @param _nonces array of vote nonce
    function revealBallot(
        bytes32 _proposalID,
        address[] calldata _validators,
        Candidate[] calldata _choices,
        uint256[] calldata _nonces
    ) external onlyOwner {
        require(
            voteInfos[_proposalID].state != VoteState.INVALID &&
                _validators.length == _choices.length &&
                _validators.length == _nonces.length,
            "E001"
        );
        require(voteInfos[_proposalID].state == VoteState.RUNNING, "E002");
        require(block.timestamp >= voteInfos[_proposalID].openVote, "E004");

        uint256 len = _validators.length;
        uint256 _revealCount = ballots[_proposalID].revealCount;
        address _validator;
        bytes32 dataHash;

        for (uint256 i = 0; i < len; ++i) {
            _validator = _validators[i];
            if (isContainBallot(_proposalID, _validator)) {
                require(_nonces[i] != 0, "E001");

                dataHash = keccak256(abi.encode(_proposalID, _validator, _choices[i], _nonces[i]));
                require(dataHash == ballots[_proposalID].values[_validator].commitment, "E001");

                if (ballots[_proposalID].values[_validator].nonce == 0) {
                    ++_revealCount;
                }
                ballots[_proposalID].values[_validator].choice = _choices[i];
                ballots[_proposalID].values[_validator].nonce = _nonces[i];
            }
        }

        ballots[_proposalID].revealCount = _revealCount;
    }

    /// @notice count vote result after all ballot are revealed
    /// @param _proposalID id of proposal
    function countVote(bytes32 _proposalID) public onlyOwner {
        onlyVoteWithState(_proposalID, VoteState.RUNNING);
        require(ballots[_proposalID].revealCount == getBallotCount(_proposalID), "E002");
        require(block.timestamp >= voteInfos[_proposalID].openVote && voteInfos[_proposalID].openVote > 0, "E004");

        uint64[] memory voteResult = new uint64[](3);
        uint256 revealCount = ballots[_proposalID].revealCount;

        for (uint256 i = 0; i < revealCount; i++) {
            Candidate choice = ballots[_proposalID].values[ballots[_proposalID].keys[i]].choice;
            if (choice <= Candidate.NO) {
                voteResult[uint256(choice)]++;
            }
        }

        voteInfos[_proposalID].state = VoteState.FINISHED;
        voteInfos[_proposalID].voteResult = voteResult;

        ICommonsBudget(voteInfos[_proposalID].commonsBudgetAddress).finishVote(
            _proposalID,
            validators[_proposalID].keys.length,
            voteResult
        );
        emit VoteResultPublished(_proposalID);
    }

    /// @notice get vote result
    /// @param _proposalID id of proposal
    function getVoteResult(bytes32 _proposalID) external view override returns (uint64[] memory) {
        onlyVoteWithState(_proposalID, VoteState.FINISHED);
        return voteInfos[_proposalID].voteResult;
    }
}
