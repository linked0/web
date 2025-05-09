// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IStakeManager.sol";

interface IEntryPoint is IStakeManager {
  /**
   * Gas and return values during simulation.
   * @param preOpGas         - The gas used for validation (including preValidationGas)
   * @param prefund          - The required prefund for this operation
   */
  struct ReturnInfo {
    uint256 preOpGas;
    uint256 prefund;
  }
}
