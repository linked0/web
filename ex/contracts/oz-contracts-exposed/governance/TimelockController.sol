// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/governance/TimelockController.sol";
import "../../contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../../contracts/token/ERC1155/IERC1155Receiver.sol";
import "../../contracts/token/ERC721/utils/ERC721Holder.sol";
import "../../contracts/token/ERC721/IERC721Receiver.sol";
import "../../contracts/access/AccessControl.sol";
import "../../contracts/utils/introspection/ERC165.sol";
import "../../contracts/utils/introspection/IERC165.sol";
import "../../contracts/access/IAccessControl.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

contract $TimelockController is TimelockController {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_grantRole(bool ret0);

    event return$_revokeRole(bool ret0);

    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin) TimelockController(minDelay, proposers, executors, admin) payable {
    }

    function $_DONE_TIMESTAMP() external pure returns (uint256) {
        return _DONE_TIMESTAMP;
    }

    function $_execute(address target,uint256 value,bytes calldata data) external {
        super._execute(target,value,data);
    }

    function $_encodeStateBitmap(OperationState operationState) external pure returns (bytes32 ret0) {
        (ret0) = super._encodeStateBitmap(operationState);
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
}
