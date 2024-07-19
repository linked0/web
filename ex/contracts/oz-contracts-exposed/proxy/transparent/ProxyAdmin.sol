// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/proxy/transparent/ProxyAdmin.sol";
import "../../../contracts/access/Ownable.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Utils.sol";
import "../../../contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../../../contracts/interfaces/IERC1967.sol";
import "../../../contracts/proxy/beacon/IBeacon.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/proxy/Proxy.sol";
import "../../../contracts/utils/Errors.sol";

contract $ProxyAdmin is ProxyAdmin {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address initialOwner) ProxyAdmin(initialOwner) payable {
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
