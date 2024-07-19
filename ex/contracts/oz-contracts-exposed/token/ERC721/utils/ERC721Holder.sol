// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/token/ERC721/utils/ERC721Holder.sol";
import "../../../../contracts/token/ERC721/IERC721Receiver.sol";

contract $ERC721Holder is ERC721Holder {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
