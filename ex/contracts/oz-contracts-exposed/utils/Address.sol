// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/utils/Address.sol";
import "../../contracts/utils/Errors.sol";

contract $Address {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$functionCall(bytes ret0);

    event return$functionCallWithValue(bytes ret0);

    event return$functionDelegateCall(bytes ret0);

    constructor() payable {
    }

    function $sendValue(address payable recipient,uint256 amount) external payable {
        Address.sendValue(recipient,amount);
    }

    function $functionCall(address target,bytes calldata data) external payable returns (bytes memory ret0) {
        (ret0) = Address.functionCall(target,data);
        emit return$functionCall(ret0);
    }

    function $functionCallWithValue(address target,bytes calldata data,uint256 value) external payable returns (bytes memory ret0) {
        (ret0) = Address.functionCallWithValue(target,data,value);
        emit return$functionCallWithValue(ret0);
    }

    function $functionStaticCall(address target,bytes calldata data) external view returns (bytes memory ret0) {
        (ret0) = Address.functionStaticCall(target,data);
    }

    function $functionDelegateCall(address target,bytes calldata data) external payable returns (bytes memory ret0) {
        (ret0) = Address.functionDelegateCall(target,data);
        emit return$functionDelegateCall(ret0);
    }

    function $verifyCallResultFromTarget(address target,bool success,bytes calldata returndata) external view returns (bytes memory ret0) {
        (ret0) = Address.verifyCallResultFromTarget(target,success,returndata);
    }

    function $verifyCallResult(bool success,bytes calldata returndata) external pure returns (bytes memory ret0) {
        (ret0) = Address.verifyCallResult(success,returndata);
    }

    receive() external payable {}
}
