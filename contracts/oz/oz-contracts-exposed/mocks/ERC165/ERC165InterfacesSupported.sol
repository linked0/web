// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/ERC165/ERC165InterfacesSupported.sol";
import "../../../contracts/utils/introspection/IERC165.sol";

contract $SupportsInterfaceWithLookupMock is SupportsInterfaceWithLookupMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() payable {
    }

    function $_registerInterface(bytes4 interfaceId) external {
        super._registerInterface(interfaceId);
    }

    receive() external payable {}
}

contract $ERC165InterfacesSupported is ERC165InterfacesSupported {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(bytes4[] memory interfaceIds) ERC165InterfacesSupported(interfaceIds) payable {
    }

    function $_registerInterface(bytes4 interfaceId) external {
        super._registerInterface(interfaceId);
    }

    receive() external payable {}
}
