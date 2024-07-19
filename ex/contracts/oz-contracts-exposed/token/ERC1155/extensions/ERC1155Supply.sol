// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../../contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "../../../../contracts/token/ERC1155/ERC1155.sol";
import "../../../../contracts/interfaces/draft-IERC6093.sol";
import "../../../../contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "../../../../contracts/token/ERC1155/IERC1155.sol";
import "../../../../contracts/utils/introspection/ERC165.sol";
import "../../../../contracts/utils/introspection/IERC165.sol";
import "../../../../contracts/utils/Context.sol";
import "../../../../contracts/token/ERC1155/utils/ERC1155Utils.sol";
import "../../../../contracts/utils/Arrays.sol";
import "../../../../contracts/token/ERC1155/IERC1155Receiver.sol";
import "../../../../contracts/utils/SlotDerivation.sol";
import "../../../../contracts/utils/StorageSlot.sol";
import "../../../../contracts/utils/math/Math.sol";
import "../../../../contracts/utils/Panic.sol";
import "../../../../contracts/utils/math/SafeCast.sol";

contract $ERC1155Supply is ERC1155Supply {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(string memory uri_) ERC1155(uri_) payable {
    }

    function $_update(address from,address to,uint256[] calldata ids,uint256[] calldata values) external {
        super._update(from,to,ids,values);
    }

    function $_updateWithAcceptanceCheck(address from,address to,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external {
        super._updateWithAcceptanceCheck(from,to,ids,values,data);
    }

    function $_safeTransferFrom(address from,address to,uint256 id,uint256 value,bytes calldata data) external {
        super._safeTransferFrom(from,to,id,value,data);
    }

    function $_safeBatchTransferFrom(address from,address to,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external {
        super._safeBatchTransferFrom(from,to,ids,values,data);
    }

    function $_setURI(string calldata newuri) external {
        super._setURI(newuri);
    }

    function $_mint(address to,uint256 id,uint256 value,bytes calldata data) external {
        super._mint(to,id,value,data);
    }

    function $_mintBatch(address to,uint256[] calldata ids,uint256[] calldata values,bytes calldata data) external {
        super._mintBatch(to,ids,values,data);
    }

    function $_burn(address from,uint256 id,uint256 value) external {
        super._burn(from,id,value);
    }

    function $_burnBatch(address from,uint256[] calldata ids,uint256[] calldata values) external {
        super._burnBatch(from,ids,values);
    }

    function $_setApprovalForAll(address owner,address operator,bool approved) external {
        super._setApprovalForAll(owner,operator,approved);
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
