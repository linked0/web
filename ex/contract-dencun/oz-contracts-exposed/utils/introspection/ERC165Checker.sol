// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/introspection/ERC165Checker.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC165Checker {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $supportsERC165(address account) external view returns (bool ret0) {
        (ret0) = ERC165Checker.supportsERC165(account);
    }

    function $supportsInterface(address account,bytes4 interfaceId) external view returns (bool ret0) {
        (ret0) = ERC165Checker.supportsInterface(account,interfaceId);
    }

    function $getSupportedInterfaces(address account,bytes4[] calldata interfaceIds) external view returns (bool[] memory ret0) {
        (ret0) = ERC165Checker.getSupportedInterfaces(account,interfaceIds);
    }

    function $supportsAllInterfaces(address account,bytes4[] calldata interfaceIds) external view returns (bool ret0) {
        (ret0) = ERC165Checker.supportsAllInterfaces(account,interfaceIds);
    }

    function $supportsERC165InterfaceUnchecked(address account,bytes4 interfaceId) external view returns (bool ret0) {
        (ret0) = ERC165Checker.supportsERC165InterfaceUnchecked(account,interfaceId);
    }

    receive() external payable {}
}
