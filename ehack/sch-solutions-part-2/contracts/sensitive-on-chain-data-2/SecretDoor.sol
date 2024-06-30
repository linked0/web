// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecretDoor is Ownable, ReentrancyGuard {

  bool public isLocked;
  uint8 private doorNumber;
  bytes32 private doorOwnerName;
  bytes32 private secretSpell;

  constructor(
    uint8 _doorNumber, bool _isLocked,
    bytes32 _doorOwnerName, bytes32 _secretSpell) {

    doorNumber = _doorNumber;
    isLocked = _isLocked;

    doorOwnerName = _doorOwnerName;
    secretSpell = _secretSpell;
  }

  function unlockDoor(bytes32 _secretSpell) external returns (bool) {

    if (secretSpell == _secretSpell) {
      isLocked = false;
    } else {
      isLocked = true;
    }

    return !(isLocked);
  }
}