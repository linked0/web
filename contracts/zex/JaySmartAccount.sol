// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../interfaces/UserOperation.sol";
import "./BaseAccount.sol";
import "../utils/Logger.sol";
import "../interfaces/IPluginJay.sol";
import "hardhat/console.sol";

/**
 * @title MySmartAccount
 * @dev MySmartAccount contract.
 * This contract provides the specific logic for implementing the IAccount interface - validateUserOp
 */
contract JaySmartAccount is BaseAccount, Logger {
  uint256 public store = 0;

  event UserOpParsed(address sender, bytes signature);

  function getSigValidationFailed() public pure returns (uint256) {
    return SIG_VALIDATION_FAILED;
  }

  function getStore() public view returns (uint256) {
    return store;
  }

  function setStore(uint256 _store) public {
    pushLog("setStore", _store);
    store = _store;
  }

  function _validateSignature(
    UserOperation calldata userOp,
    bytes32 userOpHash
  ) internal virtual override returns (uint256 validationData) {
    // validate the signature
    // if signature is invalid, return SIG_VALIDATION_FAILED
    // if signature is valid, return 0
    return 0;
  }

  /**
   * Custom-encoded array of UserOperations in `userOps`.
   * Layout:
   *  userOps[0..31]: total length of the payload (standard Solidity bytes format).
   *  Then repeated for each UserOperation:
   *   1) sender (20 bytes)
   *   2) signature length (32 bytes)
   *   3) signature (N bytes)
   */
  function multiUserOp(bytes memory userOps) public {
    uint iterationCount;
    assembly {
      // total length of the `userOps` payload (after the first 32 bytes)
      let totalLen := mload(userOps)

      // pointer to the start of actual data
      // userOps points to the length field, so the data begins at userOps + 0x20
      let offset := add(userOps, 0x20)

      // pointer to the end of data
      let end := add(offset, totalLen)

      // initialize a counter
      let count := 0

      // loop while offset < end
      for {

      } lt(offset, end) {
        count := add(count, 1)
      } {
        // 1) Read sender (20 bytes)
        let sender := shr(96, mload(offset))
        offset := add(offset, 20)

        // 2) Read signature length (32 bytes)
        let sigLen := mload(offset)
        offset := add(offset, 0x20)

        // 3) The signature data starts immediately after
        let sigData := offset
        // Advance offset by sigLen
        offset := add(offset, sigLen)

        // -----------------------------
        // Call an internal helper to log or handle the userOp
        // We’ll do it in Solidity (not pure assembly) by creating a small stack buffer
        // and calling a private function. For the event, we can pass them up from assembly.
        // -----------------------------
        // Store the first 32 bytes of memory that will be used as arguments to the helper
        // We pass:
        //   arg0 = sender
        //   arg1 = sigData pointer
        //   arg2 = sigLen
        // For a real system, you'd pass them more carefully, or do it outside assembly.

        // We'll just do an internal function call:
        // push arguments onto stack in reverse order
        mstore(0x00, sigLen)
        mstore(0x20, sigData)
        mstore(0x40, sender)

        // We can call a private function to emit an event, passing these 3 words.
        // function handleUserOpParsed(address sender, uint256 sigPtr, uint256 sigLen)
        // For brevity, let's do the entire event emission in inline assembly too.

        // A simpler approach is to let the function finish and read them in memory.
        // We'll store them, then "emit" via normal solidity after the assembly block.
      }

      // assign the computed count to our external variable
      iterationCount := count

      // exit assembly block
    }

    pushLog("multiUserOp", iterationCount);

    // Note: If you want to actually emit an event for each userOp, you could:
    //   1) do a second pass in Solidity,
    //   2) or carefully do `logX` from inline assembly for each userOp,
    //   3) or build a dynamic array in memory and process it after assembly.
    //
    // For demonstration, let's keep it minimal.
  }

  function installPlugin(
    address plugin,
    bytes32 manifestHash,
    bytes calldata pluginInstallData
  ) external {
    PluginManifest memory manifest = IPlugin(plugin).pluginManifest();
    console.log("Plugin installed:");
    console.logBytes32(manifestHash);
    console.log("Plugin Name:", manifest.name);
    console.log("Plugin Version:", manifest.version);
    console.log("Plugin Author:", manifest.author);
  }

  function getPluginAddress(uint256 index) public pure returns (address) {
    return address(0x0);
  }
}
