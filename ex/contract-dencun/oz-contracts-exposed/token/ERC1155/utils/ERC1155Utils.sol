// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/token/ERC1155/utils/ERC1155Utils.sol";
import "../../../../contracts/token/ERC1155/IERC1155Receiver.sol";
import "../../../../contracts/interfaces/draft-IERC6093.sol";
import "../../../../contracts/utils/introspection/IERC165.sol";

contract $ERC1155Utils {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $checkOnERC1155Received(address operator,address from,address to,uint256 id,uint256 value,bytes calldata data) external payable {
        ERC1155Utils.checkOnERC1155Received(operator,from,to,id,value,data);
    }

    function $checkOnERC1155BatchReceived(address operator,address from,address to,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external payable {
        ERC1155Utils.checkOnERC1155BatchReceived(operator,from,to,ids,values,data);
    }

    receive() external payable {}
}
