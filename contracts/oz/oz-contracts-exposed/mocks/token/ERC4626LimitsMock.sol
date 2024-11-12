// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC4626LimitsMock.sol";
import "../../../contracts/token/ERC20/extensions/ERC4626.sol";
import "../../../contracts/interfaces/IERC4626.sol";
import "../../../contracts/token/ERC20/ERC20.sol";
import "../../../contracts/interfaces/draft-IERC6093.sol";
import "../../../contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../contracts/token/ERC20/IERC20.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/token/ERC20/utils/SafeERC20.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/interfaces/IERC1363.sol";
import "../../../contracts/utils/Address.sol";
import "../../../contracts/utils/Panic.sol";
import "../../../contracts/utils/math/SafeCast.sol";
import "../../../contracts/interfaces/IERC20.sol";
import "../../../contracts/interfaces/IERC165.sol";
import "../../../contracts/utils/Errors.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC4626LimitsMock is ERC4626LimitsMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(string memory name_, string memory symbol_, IERC20 asset_) ERC20(name_, symbol_) ERC4626(asset_) payable {
    }

    function $_maxDeposit() external view returns (uint256) {
        return _maxDeposit;
    }

    function $_maxMint() external view returns (uint256) {
        return _maxMint;
    }

    function $_convertToShares(uint256 assets,Math.Rounding rounding) external view returns (uint256 ret0) {
        (ret0) = super._convertToShares(assets,rounding);
    }

    function $_convertToAssets(uint256 shares,Math.Rounding rounding) external view returns (uint256 ret0) {
        (ret0) = super._convertToAssets(shares,rounding);
    }

    function $_deposit(address caller,address receiver,uint256 assets,uint256 shares) external {
        super._deposit(caller,receiver,assets,shares);
    }

    function $_withdraw(address caller,address receiver,address owner,uint256 assets,uint256 shares) external {
        super._withdraw(caller,receiver,owner,assets,shares);
    }

    function $_decimalsOffset() external view returns (uint8 ret0) {
        (ret0) = super._decimalsOffset();
    }

    function $_transfer(address from,address to,uint256 value) external {
        super._transfer(from,to,value);
    }

    function $_update(address from,address to,uint256 value) external {
        super._update(from,to,value);
    }

    function $_mint(address account,uint256 value) external {
        super._mint(account,value);
    }

    function $_burn(address account,uint256 value) external {
        super._burn(account,value);
    }

    function $_approve(address owner,address spender,uint256 value) external {
        super._approve(owner,spender,value);
    }

    function $_approve(address owner,address spender,uint256 value,bool emitEvent) external {
        super._approve(owner,spender,value,emitEvent);
    }

    function $_spendAllowance(address owner,address spender,uint256 value) external {
        super._spendAllowance(owner,spender,value);
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
