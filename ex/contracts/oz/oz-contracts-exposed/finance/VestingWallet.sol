// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/finance/VestingWallet.sol";
import "../../contracts/access/Ownable.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/token/ERC20/IERC20.sol";
import "../../contracts/token/ERC20/utils/SafeERC20.sol";
import "../../contracts/utils/Address.sol";
import "../../contracts/interfaces/IERC1363.sol";
import "../../contracts/utils/Errors.sol";
import "../../contracts/interfaces/IERC20.sol";
import "../../contracts/interfaces/IERC165.sol";
import "../../contracts/utils/introspection/IERC165.sol";

contract $VestingWallet is VestingWallet {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address beneficiary, uint64 startTimestamp, uint64 durationSeconds) VestingWallet(beneficiary, startTimestamp, durationSeconds) payable {
    }

    function $_vestingSchedule(uint256 totalAllocation,uint64 timestamp) external view returns (uint256 ret0) {
        (ret0) = super._vestingSchedule(totalAllocation,timestamp);
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
}
