// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// NOTE: https://soliditylang.org/blog/2024/01/26/transient-storage/

contract DoubleBufferContract {
  uint[] bufferA;
  uint[] bufferB;

  modifier nonreentrant(bytes32 key) {
    assembly {
      if tload(key) {
        revert(0, 0)
      }
      tstore(key, 1)
    }
    _;
    assembly {
      tstore(key, 0)
    }
  }

  bytes32 constant A_LOCK = keccak256("a");
  bytes32 constant B_LOCK = keccak256("b");

  function pushA() public payable nonreentrant(A_LOCK) {
    bufferA.push(msg.value);
  }
  function popA() public nonreentrant(A_LOCK) {
    require(bufferA.length > 0);

    (bool success, ) = msg.sender.call{value: bufferA[bufferA.length - 1]}("");
    require(success);
    bufferA.pop();
  }

  function pushB() public payable nonreentrant(B_LOCK) {
    bufferB.push(msg.value);
  }
  function popB() public nonreentrant(B_LOCK) {
    require(bufferB.length > 0);

    (bool success, ) = msg.sender.call{value: bufferB[bufferB.length - 1]}("");
    require(success);
    bufferB.pop();
  }
}
