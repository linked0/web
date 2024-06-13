/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./IAccountExecute.sol";

import "hardhat/console.sol";

contract ExecAccount is IAccountExecute {
  constructor() {}

  event Executed(PackedUserOperation userOp, bytes innerCallRet);

  /// @inheritdoc IAccountExecute
  function executeUserOp(
    PackedUserOperation calldata userOp,
    uint value
  ) external returns (bool) {
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

    emit Executed(userOp, innerCallRet);
    bytes32 encodedValue = keccak256(abi.encodePacked("Got it!"));
    console.log(_toHexString(encodedValue));

    return true;
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
}
