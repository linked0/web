// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title EnumerableSetTest
 * @dev This contract is for testing purposes only.
 */
contract EnumerableSetTest {
    using EnumerableSet for EnumerableSet.UintSet;

    EnumerableSet.UintSet private _set;

    function add(uint256 value) public {
        _set.add(value);
    }

    function remove(uint256 value) public {
        _set.remove(value);
    }

    function contains(uint256 value) public view returns (bool) {
        return _set.contains(value);
    }
}
