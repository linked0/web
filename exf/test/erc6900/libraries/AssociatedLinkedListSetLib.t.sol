// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {AssociatedLinkedListSet, AssociatedLinkedListSetLib, SENTINEL_VALUE, SetValue} from "@erc6900/libraries/AssociatedLinkedListSetLib.sol";

contract AssociatedLinkedListSetLibTest is Test {
    using AssociatedLinkedListSetLib for AssociatedLinkedListSet;

    AssociatedLinkedListSet internal _set1;
    AssociatedLinkedListSet internal _set2;

    address internal _associated = address(this);

    // User-defined function for wrapping from bytes30 (uint240) to SetValue
    // Can define a custom one for addresses, uints, etc.
    function _getListValue(uint240 value) internal pure returns (SetValue) {
        return SetValue.wrap(bytes30(value));
    }

    function test_add_contains() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));
    }

    function test_empty() public {
        SetValue value = _getListValue(12);

        assertFalse(_set1.contains(_associated, value));
        assertTrue(_set1.isEmpty(_associated));
    }

    function test_remove() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        assertTrue(_set1.tryRemove(_associated, value));
        assertFalse(_set1.contains(_associated, value));
    }

    function test_remove_empty() public {
        SetValue value = _getListValue(12);

        assertFalse(_set1.tryRemove(_associated, value));
    }

    function test_remove_nonexistent() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        SetValue value2 = _getListValue(13);
        assertFalse(_set1.tryRemove(_associated, value2));
        assertTrue(_set1.contains(_associated, value));
    }

    function test_remove_nonexistent_empty() public {
        SetValue value = _getListValue(12);

        assertFalse(_set1.tryRemove(_associated, value));
    }

    function test_remove_nonexistent_empty2() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        SetValue value2 = _getListValue(13);
        assertFalse(_set1.tryRemove(_associated, value2));
        assertTrue(_set1.contains(_associated, value));
    }

    function test_add_remove_add() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        assertTrue(_set1.tryRemove(_associated, value));
        assertFalse(_set1.contains(_associated, value));

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));
    }

    function test_add_remove_add_empty() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        assertTrue(_set1.tryRemove(_associated, value));
        assertFalse(_set1.contains(_associated, value));

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));
    }

    function test_no_address_collision() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));
        assertFalse(_set2.contains(_associated, value));
    }

    function test_clear() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        _set1.clear(_associated);

        assertFalse(_set1.contains(_associated, value));
        assertTrue(_set1.isEmpty(_associated));
    }

    function test_getAll() public {
        SetValue value = _getListValue(12);
        SetValue value2 = _getListValue(13);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.tryAdd(_associated, value2));

        SetValue[] memory values = _set1.getAll(_associated);
        assertEq(values.length, 2);
        // Returned set will be in reverse order of added elements
        assertEq(SetValue.unwrap(values[1]), SetValue.unwrap(value));
        assertEq(SetValue.unwrap(values[0]), SetValue.unwrap(value2));
    }

    function test_getAll2() public {
        SetValue value = _getListValue(12);
        SetValue value2 = _getListValue(13);
        SetValue value3 = _getListValue(14);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.tryAdd(_associated, value2));
        assertTrue(_set1.tryAdd(_associated, value3));

        SetValue[] memory values = _set1.getAll(_associated);
        assertEq(values.length, 3);
        // Returned set will be in reverse order of added elements
        assertEq(SetValue.unwrap(values[2]), SetValue.unwrap(value));
        assertEq(SetValue.unwrap(values[1]), SetValue.unwrap(value2));
        assertEq(SetValue.unwrap(values[0]), SetValue.unwrap(value3));
    }

    function test_getAll_empty() public {
        SetValue[] memory values = _set1.getAll(_associated);
        assertEq(values.length, 0);
    }

    function test_tryRemoveKnown1() public {
        SetValue value = _getListValue(12);

        assertTrue(_set1.tryAdd(_associated, value));
        assertTrue(_set1.contains(_associated, value));

        assertTrue(_set1.tryRemoveKnown(_associated, value, SENTINEL_VALUE));
        assertFalse(_set1.contains(_associated, value));
        assertTrue(_set1.isEmpty(_associated));
    }

    function test_tryRemoveKnown2() public {
        SetValue value1 = _getListValue(12);
        SetValue value2 = _getListValue(13);

        assertTrue(_set1.tryAdd(_associated, value1));
        assertTrue(_set1.tryAdd(_associated, value2));
        assertTrue(_set1.contains(_associated, value1));
        assertTrue(_set1.contains(_associated, value2));

        // Assert that getAll returns the correct values
        SetValue[] memory values = _set1.getAll(_associated);
        assertEq(values.length, 2);
        assertEq(SetValue.unwrap(values[1]), SetValue.unwrap(value1));
        assertEq(SetValue.unwrap(values[0]), SetValue.unwrap(value2));

        assertTrue(
            _set1.tryRemoveKnown(
                _associated,
                value1,
                bytes32(SetValue.unwrap(value2))
            )
        );
        assertFalse(_set1.contains(_associated, value1));
        assertTrue(_set1.contains(_associated, value2));

        // Assert that getAll returns the correct values
        values = _set1.getAll(_associated);
        assertEq(values.length, 1);
        assertEq(SetValue.unwrap(values[0]), SetValue.unwrap(value2));

        assertTrue(_set1.tryRemoveKnown(_associated, value2, SENTINEL_VALUE));
        assertFalse(_set1.contains(_associated, value1));

        assertTrue(_set1.isEmpty(_associated));
    }

    function test_tryRemoveKnown_invalid1() public {
        SetValue value1 = _getListValue(12);
        SetValue value2 = _getListValue(13);

        assertTrue(_set1.tryAdd(_associated, value1));
        assertTrue(_set1.tryAdd(_associated, value2));

        assertFalse(
            _set1.tryRemoveKnown(
                _associated,
                value1,
                bytes32(SetValue.unwrap(value1))
            )
        );
        assertTrue(_set1.contains(_associated, value1));

        assertFalse(
            _set1.tryRemoveKnown(
                _associated,
                value2,
                bytes32(SetValue.unwrap(value2))
            )
        );
        assertTrue(_set1.contains(_associated, value2));
    }
}
