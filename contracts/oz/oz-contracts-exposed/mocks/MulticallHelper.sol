// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/MulticallHelper.sol";
import "../../contracts/mocks/token/ERC20MulticallMock.sol";
import "../../contracts/token/ERC20/ERC20.sol";
import "../../contracts/utils/Multicall.sol";
import "../../contracts/token/ERC20/IERC20.sol";
import "../../contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/interfaces/draft-IERC6093.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

contract $MulticallHelper is MulticallHelper {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
