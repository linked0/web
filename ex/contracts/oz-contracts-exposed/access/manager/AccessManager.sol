// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/access/manager/AccessManager.sol";
import "../../../contracts/access/manager/IAccessManager.sol";
import "../../../contracts/utils/Multicall.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/access/manager/IAccessManaged.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/types/Time.sol";
import "../../../contracts/utils/Errors.sol";
import "../../../contracts/utils/Panic.sol";
import "../../../contracts/utils/math/SafeCast.sol";

contract $AccessManager is AccessManager {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_grantRole(bool ret0);

    event return$_revokeRole(bool ret0);

    event return$_consumeScheduledOp(uint32 ret0);

    constructor(address initialAdmin) AccessManager(initialAdmin) payable {
    }

    function $_grantRole(uint64 roleId,address account,uint32 grantDelay,uint32 executionDelay) external returns (bool ret0) {
        (ret0) = super._grantRole(roleId,account,grantDelay,executionDelay);
        emit return$_grantRole(ret0);
    }

    function $_revokeRole(uint64 roleId,address account) external returns (bool ret0) {
        (ret0) = super._revokeRole(roleId,account);
        emit return$_revokeRole(ret0);
    }

    function $_setRoleAdmin(uint64 roleId,uint64 admin) external {
        super._setRoleAdmin(roleId,admin);
    }

    function $_setRoleGuardian(uint64 roleId,uint64 guardian) external {
        super._setRoleGuardian(roleId,guardian);
    }

    function $_setGrantDelay(uint64 roleId,uint32 newDelay) external {
        super._setGrantDelay(roleId,newDelay);
    }

    function $_setTargetFunctionRole(address target,bytes4 selector,uint64 roleId) external {
        super._setTargetFunctionRole(target,selector,roleId);
    }

    function $_setTargetAdminDelay(address target,uint32 newDelay) external {
        super._setTargetAdminDelay(target,newDelay);
    }

    function $_setTargetClosed(address target,bool closed) external {
        super._setTargetClosed(target,closed);
    }

    function $_consumeScheduledOp(bytes32 operationId) external returns (uint32 ret0) {
        (ret0) = super._consumeScheduledOp(operationId);
        emit return$_consumeScheduledOp(ret0);
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
