// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ICommonsStorage {
    /// @notice set a per-mil of the fund to be used for a fee for a funding proposal
    /// @param _value a value of the per-mil unit
    function setFundProposalFeePermil(uint32 _value) external;

    /// @notice set a fee for a system proposal
    /// @param _value a value of the fee
    function setSystemProposalFee(uint256 _value) external;

    /// @notice set a required factor for a quorum
    /// @param _value a value of the per-mil unit for the factor
    function setVoteQuorumFactor(uint32 _value) external;

    /// @notice set a voter fee
    /// @param _value a value of the cent of BOA
    function setVoterFee(uint256 _value) external;
}
