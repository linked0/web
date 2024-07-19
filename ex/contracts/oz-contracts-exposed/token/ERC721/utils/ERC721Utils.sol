// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/token/ERC721/utils/ERC721Utils.sol";
import "../../../../contracts/token/ERC721/IERC721Receiver.sol";
import "../../../../contracts/interfaces/draft-IERC6093.sol";

contract $ERC721Utils {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $checkOnERC721Received(address operator,address from,address to,uint256 tokenId,bytes calldata data) external payable {
        ERC721Utils.checkOnERC721Received(operator,from,to,tokenId,data);
    }

    receive() external payable {}
}
