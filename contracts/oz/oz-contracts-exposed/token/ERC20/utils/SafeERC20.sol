// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../../contracts/token/ERC20/IERC20.sol";
import "../../../../contracts/interfaces/IERC1363.sol";
import "../../../../contracts/utils/Address.sol";
import "../../../../contracts/interfaces/IERC20.sol";
import "../../../../contracts/interfaces/IERC165.sol";
import "../../../../contracts/utils/Errors.sol";
import "../../../../contracts/utils/introspection/IERC165.sol";

contract $SafeERC20 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $safeTransfer(IERC20 token,address to,uint256 value) external payable {
        SafeERC20.safeTransfer(token,to,value);
    }

    function $safeTransferFrom(IERC20 token,address from,address to,uint256 value) external payable {
        SafeERC20.safeTransferFrom(token,from,to,value);
    }

    function $safeIncreaseAllowance(IERC20 token,address spender,uint256 value) external payable {
        SafeERC20.safeIncreaseAllowance(token,spender,value);
    }

    function $safeDecreaseAllowance(IERC20 token,address spender,uint256 requestedDecrease) external payable {
        SafeERC20.safeDecreaseAllowance(token,spender,requestedDecrease);
    }

    function $forceApprove(IERC20 token,address spender,uint256 value) external payable {
        SafeERC20.forceApprove(token,spender,value);
    }

    function $transferAndCallRelaxed(IERC1363 token,address to,uint256 value,bytes calldata data) external payable {
        SafeERC20.transferAndCallRelaxed(token,to,value,data);
    }

    function $transferFromAndCallRelaxed(IERC1363 token,address from,address to,uint256 value,bytes calldata data) external payable {
        SafeERC20.transferFromAndCallRelaxed(token,from,to,value,data);
    }

    function $approveAndCallRelaxed(IERC1363 token,address to,uint256 value,bytes calldata data) external payable {
        SafeERC20.approveAndCallRelaxed(token,to,value,data);
    }

    receive() external payable {}
}
