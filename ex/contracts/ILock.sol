// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILock {
  function setLockTime(uint _unlockTime) external;
  function getUnlockTime() external view returns (uint);
}
