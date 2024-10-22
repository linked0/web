// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ERC3156FlashBorrowerMock.sol";
import "../../contracts/interfaces/IERC3156FlashBorrower.sol";
import "../../contracts/token/ERC20/IERC20.sol";
import "../../contracts/interfaces/IERC3156.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/interfaces/IERC3156FlashLender.sol";
import "../../contracts/utils/Errors.sol";

contract $ERC3156FlashBorrowerMock is ERC3156FlashBorrowerMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(bool enableReturn, bool enableApprove) ERC3156FlashBorrowerMock(enableReturn, enableApprove) payable {
    }

    function $_RETURN_VALUE() external pure returns (bytes32) {
        return _RETURN_VALUE;
    }

    function $_enableApprove() external view returns (bool) {
        return _enableApprove;
    }

    function $_enableReturn() external view returns (bool) {
        return _enableReturn;
    }

    receive() external payable {}
}
