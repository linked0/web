// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/governance/GovernorTimelockCompoundMock.sol";
import "../../../contracts/governance/extensions/GovernorCountingSimple.sol";
import "../../../contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "../../../contracts/governance/extensions/GovernorVotes.sol";
import "../../../contracts/governance/extensions/GovernorTimelockCompound.sol";
import "../../../contracts/governance/extensions/GovernorSettings.sol";
import "../../../contracts/governance/Governor.sol";
import "../../../contracts/token/ERC1155/IERC1155Receiver.sol";
import "../../../contracts/token/ERC721/IERC721Receiver.sol";
import "../../../contracts/governance/IGovernor.sol";
import "../../../contracts/interfaces/IERC6372.sol";
import "../../../contracts/utils/Nonces.sol";
import "../../../contracts/utils/cryptography/EIP712.sol";
import "../../../contracts/interfaces/IERC5267.sol";
import "../../../contracts/utils/introspection/ERC165.sol";
import "../../../contracts/utils/introspection/IERC165.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/utils/math/SafeCast.sol";
import "../../../contracts/utils/structs/Checkpoints.sol";
import "../../../contracts/governance/utils/IVotes.sol";
import "../../../contracts/interfaces/IERC5805.sol";
import "../../../contracts/utils/types/Time.sol";
import "../../../contracts/vendor/compound/ICompoundTimelock.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/cryptography/SignatureChecker.sol";
import "../../../contracts/utils/structs/DoubleEndedQueue.sol";
import "../../../contracts/interfaces/IERC165.sol";
import "../../../contracts/utils/cryptography/MessageHashUtils.sol";
import "../../../contracts/utils/ShortStrings.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/Errors.sol";
import "../../../contracts/utils/cryptography/ECDSA.sol";
import "../../../contracts/interfaces/IERC1271.sol";
import "../../../contracts/utils/Panic.sol";
import "../../../contracts/utils/Strings.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/utils/math/SignedMath.sol";

contract $GovernorTimelockCompoundMock is GovernorTimelockCompoundMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_queueOperations(uint48 ret0);

    event return$_cancel(uint256 ret0);

    event return$_propose(uint256 proposalId);

    event return$_castVote_uint256_address_uint8_string(uint256 ret0);

    event return$_castVote_uint256_address_uint8_string_bytes(uint256 ret0);

    event return$_useNonce(uint256 ret0);

    constructor(string memory name_, uint48 initialVotingDelay, uint32 initialVotingPeriod, uint256 initialProposalThreshold, ICompoundTimelock timelockAddress, IVotes tokenAddress, uint256 quorumNumeratorValue) Governor(name_) GovernorSettings(initialVotingDelay, initialVotingPeriod, initialProposalThreshold) GovernorTimelockCompound(timelockAddress) GovernorVotes(tokenAddress) GovernorVotesQuorumFraction(quorumNumeratorValue) payable {
    }

    function $_queueOperations(uint256 proposalId,address[] calldata targets,uint256[] calldata values,bytes[] calldata calldatas,bytes32 descriptionHash) external returns (uint48 ret0) {
        (ret0) = super._queueOperations(proposalId,targets,values,calldatas,descriptionHash);
        emit return$_queueOperations(ret0);
    }

    function $_executeOperations(uint256 proposalId,address[] calldata targets,uint256[] calldata values,bytes[] calldata calldatas,bytes32 descriptionHash) external {
        super._executeOperations(proposalId,targets,values,calldatas,descriptionHash);
    }

    function $_cancel(address[] calldata targets,uint256[] calldata values,bytes[] calldata calldatas,bytes32 descriptionHash) external returns (uint256 ret0) {
        (ret0) = super._cancel(targets,values,calldatas,descriptionHash);
        emit return$_cancel(ret0);
    }

    function $_executor() external view returns (address ret0) {
        (ret0) = super._executor();
    }

    function $_quorumReached(uint256 proposalId) external view returns (bool ret0) {
        (ret0) = super._quorumReached(proposalId);
    }

    function $_voteSucceeded(uint256 proposalId) external view returns (bool ret0) {
        (ret0) = super._voteSucceeded(proposalId);
    }

    function $_countVote(uint256 proposalId,address account,uint8 support,uint256 weight,bytes calldata arg4) external {
        super._countVote(proposalId,account,support,weight,arg4);
    }

    function $_updateQuorumNumerator(uint256 newQuorumNumerator) external {
        super._updateQuorumNumerator(newQuorumNumerator);
    }

    function $_getVotes(address account,uint256 timepoint,bytes calldata arg2) external view returns (uint256 ret0) {
        (ret0) = super._getVotes(account,timepoint,arg2);
    }

    function $_setVotingDelay(uint48 newVotingDelay) external {
        super._setVotingDelay(newVotingDelay);
    }

    function $_setVotingPeriod(uint32 newVotingPeriod) external {
        super._setVotingPeriod(newVotingPeriod);
    }

    function $_setProposalThreshold(uint256 newProposalThreshold) external {
        super._setProposalThreshold(newProposalThreshold);
    }

    function $_checkGovernance() external {
        super._checkGovernance();
    }

    function $_defaultParams() external view returns (bytes memory ret0) {
        (ret0) = super._defaultParams();
    }

    function $_propose(address[] calldata targets,uint256[] calldata values,bytes[] calldata calldatas,string calldata description,address proposer) external returns (uint256 proposalId) {
        (proposalId) = super._propose(targets,values,calldatas,description,proposer);
        emit return$_propose(proposalId);
    }

    function $_castVote(uint256 proposalId,address account,uint8 support,string calldata reason) external returns (uint256 ret0) {
        (ret0) = super._castVote(proposalId,account,support,reason);
        emit return$_castVote_uint256_address_uint8_string(ret0);
    }

    function $_castVote(uint256 proposalId,address account,uint8 support,string calldata reason,bytes calldata params) external returns (uint256 ret0) {
        (ret0) = super._castVote(proposalId,account,support,reason,params);
        emit return$_castVote_uint256_address_uint8_string_bytes(ret0);
    }

    function $_encodeStateBitmap(ProposalState proposalState) external pure returns (bytes32 ret0) {
        (ret0) = super._encodeStateBitmap(proposalState);
    }

    function $_isValidDescriptionForProposer(address proposer,string calldata description) external view returns (bool ret0) {
        (ret0) = super._isValidDescriptionForProposer(proposer,description);
    }

    function $_useNonce(address owner) external returns (uint256 ret0) {
        (ret0) = super._useNonce(owner);
        emit return$_useNonce(ret0);
    }

    function $_useCheckedNonce(address owner,uint256 nonce) external {
        super._useCheckedNonce(owner,nonce);
    }

    function $_domainSeparatorV4() external view returns (bytes32 ret0) {
        (ret0) = super._domainSeparatorV4();
    }

    function $_hashTypedDataV4(bytes32 structHash) external view returns (bytes32 ret0) {
        (ret0) = super._hashTypedDataV4(structHash);
    }

    function $_EIP712Name() external view returns (string memory ret0) {
        (ret0) = super._EIP712Name();
    }

    function $_EIP712Version() external view returns (string memory ret0) {
        (ret0) = super._EIP712Version();
    }

    function $_msgSender() external view returns (address ret0) {
        (ret0) = super._msgSender();
    }

    function $_msgData() external view returns (bytes memory ret0) {
        (ret0) = super._msgData();
    }

    function $_contextSuffixLength() external view returns (uint256 ret0) {
        (ret0) = super._contextSuffixLength();
    }
}
