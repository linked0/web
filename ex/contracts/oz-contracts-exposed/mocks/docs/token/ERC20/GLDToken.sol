// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../../contracts/mocks/docs/token/ERC20/GLDToken.sol";
import "../../../../../contracts/token/ERC20/ERC20.sol";
import "../../../../../contracts/interfaces/draft-IERC6093.sol";
import "../../../../../contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../../../../../contracts/token/ERC20/IERC20.sol";
import "../../../../../contracts/utils/Context.sol";

contract $GLDToken is GLDToken {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(uint256 initialSupply) GLDToken(initialSupply) payable {
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
