// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/token/common/ERC2981.sol";
import "../../../contracts/utils/introspection/ERC165.sol";
import "../../../contracts/interfaces/IERC2981.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $ERC2981 is ERC2981 {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_feeDenominator() external pure returns (uint96 ret0) {
        (ret0) = super._feeDenominator();
    }

    function $_setDefaultRoyalty(address receiver,uint96 feeNumerator) external {
        super._setDefaultRoyalty(receiver,feeNumerator);
    }

    function $_deleteDefaultRoyalty() external {
        super._deleteDefaultRoyalty();
    }

    function $_setTokenRoyalty(uint256 tokenId,address receiver,uint96 feeNumerator) external {
        super._setTokenRoyalty(tokenId,receiver,feeNumerator);
    }

    function $_resetTokenRoyalty(uint256 tokenId) external {
        super._resetTokenRoyalty(tokenId);
    }

    receive() external payable {}
}
