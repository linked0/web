// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/utils/structs/DoubleEndedQueue.sol";
import "../../../contracts/utils/Panic.sol";

contract $DoubleEndedQueue {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    mapping(uint256 => DoubleEndedQueue.Bytes32Deque) internal $v_DoubleEndedQueue_Bytes32Deque;

    event return$popBack(bytes32 value);

    event return$popFront(bytes32 value);

    constructor() payable {
    }

    function $pushBack(uint256 deque,bytes32 value) external payable {
        DoubleEndedQueue.pushBack($v_DoubleEndedQueue_Bytes32Deque[deque],value);
    }

    function $popBack(uint256 deque) external payable returns (bytes32 value) {
        (value) = DoubleEndedQueue.popBack($v_DoubleEndedQueue_Bytes32Deque[deque]);
        emit return$popBack(value);
    }

    function $pushFront(uint256 deque,bytes32 value) external payable {
        DoubleEndedQueue.pushFront($v_DoubleEndedQueue_Bytes32Deque[deque],value);
    }

    function $popFront(uint256 deque) external payable returns (bytes32 value) {
        (value) = DoubleEndedQueue.popFront($v_DoubleEndedQueue_Bytes32Deque[deque]);
        emit return$popFront(value);
    }

    function $front(uint256 deque) external view returns (bytes32 value) {
        (value) = DoubleEndedQueue.front($v_DoubleEndedQueue_Bytes32Deque[deque]);
    }

    function $back(uint256 deque) external view returns (bytes32 value) {
        (value) = DoubleEndedQueue.back($v_DoubleEndedQueue_Bytes32Deque[deque]);
    }

    function $at(uint256 deque,uint256 index) external view returns (bytes32 value) {
        (value) = DoubleEndedQueue.at($v_DoubleEndedQueue_Bytes32Deque[deque],index);
    }

    function $clear(uint256 deque) external payable {
        DoubleEndedQueue.clear($v_DoubleEndedQueue_Bytes32Deque[deque]);
    }

    function $length(uint256 deque) external view returns (uint256 ret0) {
        (ret0) = DoubleEndedQueue.length($v_DoubleEndedQueue_Bytes32Deque[deque]);
    }

    function $empty(uint256 deque) external view returns (bool ret0) {
        (ret0) = DoubleEndedQueue.empty($v_DoubleEndedQueue_Bytes32Deque[deque]);
    }

    receive() external payable {}
}
