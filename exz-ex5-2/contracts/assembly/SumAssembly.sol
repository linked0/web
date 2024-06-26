// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SumAssembly {
    function sumArray(uint256[] memory data) public pure returns (uint256 sum) {
        assembly {
            let len := mload(data)
            let dataPtr := add(data, 0x20)

            for { let end := add(dataPtr, mul(len, 0x20)) }
                lt(dataPtr, end)
                { dataPtr := add(dataPtr, 0x20) }
            {
                sum := add(sum, mload(dataPtr))
            }
        }
    }
}
