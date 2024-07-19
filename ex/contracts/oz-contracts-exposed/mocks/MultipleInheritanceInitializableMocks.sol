// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../contracts/mocks/MultipleInheritanceInitializableMocks.sol";
import "../../contracts/proxy/utils/Initializable.sol";

contract $SampleHuman is SampleHuman {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor() initializer payable {
        __SampleHuman_init();
    }

    function $__SampleHuman_init() external {
        super.__SampleHuman_init();
    }

    function $__SampleHuman_init_unchained() external {
        super.__SampleHuman_init_unchained();
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $SampleMother is SampleMother {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(uint256 value) initializer payable {
        __SampleMother_init(value);
    }

    function $__SampleMother_init(uint256 value) external {
        super.__SampleMother_init(value);
    }

    function $__SampleMother_init_unchained(uint256 value) external {
        super.__SampleMother_init_unchained(value);
    }

    function $__SampleHuman_init() external {
        super.__SampleHuman_init();
    }

    function $__SampleHuman_init_unchained() external {
        super.__SampleHuman_init_unchained();
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $SampleGramps is SampleGramps {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(string memory value) initializer payable {
        __SampleGramps_init(value);
    }

    function $__SampleGramps_init(string calldata value) external {
        super.__SampleGramps_init(value);
    }

    function $__SampleGramps_init_unchained(string calldata value) external {
        super.__SampleGramps_init_unchained(value);
    }

    function $__SampleHuman_init() external {
        super.__SampleHuman_init();
    }

    function $__SampleHuman_init_unchained() external {
        super.__SampleHuman_init_unchained();
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $SampleFather is SampleFather {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(string memory _gramps, uint256 _father) initializer payable {
        __SampleFather_init(_gramps, _father);
    }

    function $__SampleFather_init(string calldata _gramps,uint256 _father) external {
        super.__SampleFather_init(_gramps,_father);
    }

    function $__SampleFather_init_unchained(uint256 _father) external {
        super.__SampleFather_init_unchained(_father);
    }

    function $__SampleGramps_init(string calldata value) external {
        super.__SampleGramps_init(value);
    }

    function $__SampleGramps_init_unchained(string calldata value) external {
        super.__SampleGramps_init_unchained(value);
    }

    function $__SampleHuman_init() external {
        super.__SampleHuman_init();
    }

    function $__SampleHuman_init_unchained() external {
        super.__SampleHuman_init_unchained();
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}

contract $SampleChild is SampleChild {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    constructor(uint256 _mother, string memory _gramps, uint256 _father, uint256 _child) initializer payable {
        __SampleChild_init(_mother, _gramps, _father, _child);
    }

    function $__SampleChild_init(uint256 _mother,string calldata _gramps,uint256 _father,uint256 _child) external {
        super.__SampleChild_init(_mother,_gramps,_father,_child);
    }

    function $__SampleChild_init_unchained(uint256 _child) external {
        super.__SampleChild_init_unchained(_child);
    }

    function $__SampleFather_init(string calldata _gramps,uint256 _father) external {
        super.__SampleFather_init(_gramps,_father);
    }

    function $__SampleFather_init_unchained(uint256 _father) external {
        super.__SampleFather_init_unchained(_father);
    }

    function $__SampleGramps_init(string calldata value) external {
        super.__SampleGramps_init(value);
    }

    function $__SampleGramps_init_unchained(string calldata value) external {
        super.__SampleGramps_init_unchained(value);
    }

    function $__SampleMother_init(uint256 value) external {
        super.__SampleMother_init(value);
    }

    function $__SampleMother_init_unchained(uint256 value) external {
        super.__SampleMother_init_unchained(value);
    }

    function $__SampleHuman_init() external {
        super.__SampleHuman_init();
    }

    function $__SampleHuman_init_unchained() external {
        super.__SampleHuman_init_unchained();
    }

    function $_checkInitializing() external view {
        super._checkInitializing();
    }

    function $_disableInitializers() external {
        super._disableInitializers();
    }

    function $_getInitializedVersion() external view returns (uint64 ret0) {
        (ret0) = super._getInitializedVersion();
    }

    function $_isInitializing() external view returns (bool ret0) {
        (ret0) = super._isInitializing();
    }

    receive() external payable {}
}
