// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/beacon/UpgradeableBeacon.sol";
import "../../../contracts/access/Ownable.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";

contract $UpgradeableBeacon is UpgradeableBeacon {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address implementation_, address initialOwner) UpgradeableBeacon(implementation_, initialOwner) payable {
    }

    function $_checkOwner() external view {
        super._checkOwner();
    }

    function $_transferOwnership(address newOwner) external {
        super._transferOwnership(newOwner);
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

    receive() external payable {}
}
