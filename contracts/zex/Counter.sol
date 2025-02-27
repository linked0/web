// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {IPlugin} from "../interfaces/IPlugin.sol";

interface ICounter {
    function setNumber(uint256 newNumber) external;

    function increment() external;

    function genRevert() external pure;
}

contract Counter is ERC165, ICounter {
    uint256 public number;

    function setNumber(uint256 newNumber) external {
        number = newNumber;
    }

    function increment() external {
        number++;
    }

    function genRevert() external pure {
        require(false, "This function always reverts");
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(ICounter).interfaceId || 
            super.supportsInterface(interfaceId);
    }
}
