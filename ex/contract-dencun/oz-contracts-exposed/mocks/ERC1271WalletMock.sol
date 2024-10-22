// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/ERC1271WalletMock.sol";
import "../../contracts/interfaces/IERC1271.sol";
import "../../contracts/access/Ownable.sol";
import "../../contracts/utils/Context.sol";
import "../../contracts/utils/cryptography/ECDSA.sol";

contract $ERC1271WalletMock is ERC1271WalletMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(address originalOwner) ERC1271WalletMock(originalOwner) payable {
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

    receive() external payable {}
}

contract $ERC1271MaliciousMock is ERC1271MaliciousMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    receive() external payable {}
}
