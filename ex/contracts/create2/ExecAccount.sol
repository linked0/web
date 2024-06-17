/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./IAccountExecute.sol";

import "hardhat/console.sol";

contract ExecAccount is IAccountExecute {
  constructor() {}

  event Executed(string, bytes32);

  /// @inheritdoc IAccountExecute
  function executeUserOp(
    PackedUserOperation calldata userOp,
    uint value
  ) public returns (bool result) {
    bytes memory innerCallRet;
    value += 1;

    bytes calldata callData = userOp.callData;
    bytes4 methodSig;
    assembly {
      let len := callData.length
      if gt(len, 3) {
        methodSig := calldataload(callData.offset)
      }
    }

    bytes calldata innerCall = userOp.callData[4:];
    (address target, bytes memory data) = abi.decode(
      innerCall,
      (address, bytes)
    );
    bool success;
    (success, innerCallRet) = target.call(data);

    bytes32 encodedValue = keccak256(abi.encodePacked("Got it!"));
    console.log(_toHexString(encodedValue));
    emit Executed("Got it!", encodedValue);

    result = true;
  }

  function executeMultipleUserOps(
    PackedUserOperation[] calldata userOps,
    uint[] calldata values
  ) external {
    for (uint i = 0; i < userOps.length; i++) {
      executeUserOp(userOps[i], values[i]);
    }

    bytes32 encodedValue = keccak256(abi.encodePacked("Got it two!"));
    console.log(_toHexString(encodedValue));
    emit Executed("Got it two!", encodedValue);
  }

  function executeIndirect(
    PackedUserOperation calldata userOp,
    uint value
  ) external {
    bytes memory innerCallRet;
    value += 1;

    bytes calldata callData = userOp.callData;
    bytes4 methodSig;
    assembly {
      let len := callData.length
      if gt(len, 3) {
        methodSig := calldataload(callData.offset)
      }
    }

    bytes calldata innerCall = userOp.callData[4:];
    bytes memory data = abi.encodeWithSelector(methodSig, innerCall);

    bool success;
    (success, innerCallRet) = address(this).call(data);

    bytes32 encodedValue = keccak256(abi.encodePacked("Indirect"));
    console.log(_toHexString(encodedValue));
    emit Executed("Indirect", encodedValue);
  }

  function indirectInnerCall(bytes calldata paramCallData) external {
    console.log("Indirect inner call");
    bytes memory innerCallRet;
    (address target, bytes memory data) = abi.decode(
      paramCallData,
      (address, bytes)
    );
    bool success;
    (success, innerCallRet) = target.call(data);
  }

  // TODO: Make this function into my library
  // Helper function to convert bytes32 to a hexadecimal string
  function _toHexString(bytes32 data) internal pure returns (string memory) {
    bytes memory alphabet = "0123456789abcdef";
    bytes memory str = new bytes(64);

    for (uint256 i = 0; i < 32; i++) {
      str[i * 2] = alphabet[uint8(data[i] >> 4)];
      str[1 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
    }

    return string(str);
  }

  /// @notice Just a test function will be deleted later
  function test() public pure returns (string memory) {
    return "Hello World!";
  }

  // @notice Just a test function will be deleted later
  function test2() public pure returns (bool) {
    return true;
  }
}
