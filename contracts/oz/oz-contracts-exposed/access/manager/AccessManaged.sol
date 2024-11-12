// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/access/manager/AccessManaged.sol";
import "../../../contracts/access/manager/IAccessManaged.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/access/manager/IAuthority.sol";
import "../../../contracts/access/manager/AuthorityUtils.sol";
import "../../../contracts/access/manager/IAccessManager.sol";
import "../../../contracts/utils/types/Time.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/math/SafeCast.sol";
import "../../../contracts/utils/Panic.sol";

contract $AccessManaged is AccessManaged {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address initialAuthority) AccessManaged(initialAuthority) payable {
    }

    function $_setAuthority(address newAuthority) external {
        super._setAuthority(newAuthority);
    }

    function $_checkCanCall(address caller,bytes calldata data) external {
        super._checkCanCall(caller,data);
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
