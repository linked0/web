// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/mocks/docs/access-control/AccessControlModified.sol";
import "../../../../contracts/access/AccessControl.sol";
import "../../../../contracts/utils/introspection/ERC165.sol";
import "../../../../contracts/utils/introspection/IERC165.sol";
import "../../../../contracts/access/IAccessControl.sol";
import "../../../../contracts/utils/Context.sol";

contract $AccessControlModified is AccessControlModified {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_grantRole(bool ret0);

    event return$_revokeRole(bool ret0);

    constructor() payable {
    }

    function $_checkRole(bytes32 role) external view {
        super._checkRole(role);
    }

    function $_checkRole(bytes32 role,address account) external view {
        super._checkRole(role,account);
    }

    function $_setRoleAdmin(bytes32 role,bytes32 adminRole) external {
        super._setRoleAdmin(role,adminRole);
    }

    function $_grantRole(bytes32 role,address account) external returns (bool ret0) {
        (ret0) = super._grantRole(role,account);
        emit return$_grantRole(ret0);
    }

    function $_revokeRole(bytes32 role,address account) external returns (bool ret0) {
        (ret0) = super._revokeRole(role,account);
        emit return$_revokeRole(ret0);
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
