/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "./IAccountExecute.sol";

contract ExecAccount is IAccountExecute {
  constructor() {}

  event Executed(PackedUserOperation userOp, bytes innerCallRet);

  /// @inheritdoc IAccountExecute
  function executeUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash
  ) external returns (bytes memory) {
    // read from the userOp.callData, but skip the "magic" prefix (executeUserOp sig),
    // which caused it to call this method.
    // bytes calldata innerCall = userOp.callData[4 :];

    bytes memory innerCallRet;
    // if (innerCall.length > 0) {
    //   (address target, bytes memory data) = abi.decode(innerCall, (address, bytes));
    //   bool success;
    //   (success, innerCallRet) = target.call(data);
    //   require(success, "inner call failed");
    // }

    emit Executed(userOp, innerCallRet);
    return innerCallRet;
  }

  /// @notice Just a test function will be deleted later
  function test() public pure returns (string memory) {
    return "Hello World!";
  }
}
