// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./ICryptoKeeper.sol";

library CallHelpers {
    function getRevertMsg(
        bytes memory _returnData
    ) internal pure returns (string memory) {
        if (_returnData.length < 68) return "Transaction reverted silently";

        assembly {
            _returnData := add(_returnData, 0x04)
        }
        return abi.decode(_returnData, (string));
    }
}

contract CryptoKeeper is
    ICryptoKeeper,
    ERC165,
    ERC721Holder,
    ERC1155Holder,
    ReentrancyGuard
{
    using CallHelpers for bytes;

    uint8 constant public CALL_OPERATION = 1;
    uint8 constant public DELEGATECALL_OPERATION = 2;

    event Executed(
        address caller,
        address destAddress,
        bytes encodedCalldata,
        uint256 value,
        bytes result
    );
    event NewOperator(address operator);
    event OperatorRemoved(address operator);

    bool public initialized = false;
    mapping(address => bool) public operators;

    modifier isInitialized() {
        require(initialized, "Not initialized");
        _;
    }

    modifier onlyOperator(address _account) {
        require(operators[_account], "Not an operator");
        _;
    }

    function initialize(address[] calldata _operators) external {
        
        initialized = true;

        require(
            _operators.length <= 10,
            "Can't set more than 10 operators at once"
        );

        for (uint8 i = 0; i < _operators.length; i++) {
            operators[_operators[i]] = true;
            emit NewOperator(_operators[i]);
        }
    }

    function execute(
        address _destAddress,
        bytes calldata _encodedCalldata,
        uint8 operation
    ) 
        external isInitialized onlyOperator(msg.sender) returns (bytes memory) {
        return _execute(_destAddress, _encodedCalldata, 0, operation);
    }

    function executeWithValue(
        address _destAddress,
        bytes calldata _encodedCalldata,
        uint256 _value
    )
        external payable isInitialized onlyOperator(msg.sender) returns (bytes memory)
    {
        return _execute(_destAddress, _encodedCalldata, _value, CALL_OPERATION);
    }

    function _execute(
        address _destAddress,
        bytes calldata _encodedCalldata,
        uint256 _value,
        uint8 operation
    ) private nonReentrant returns (bytes memory) {

        bool success;
        bytes memory result;

        if(operation == CALL_OPERATION) {
            (success, result) = _destAddress.call{value: _value}(
                _encodedCalldata
            );
        } else if (operation == DELEGATECALL_OPERATION) {
            (success, result) = _destAddress.delegatecall(_encodedCalldata);
        } else {
            revert("Wrong operation");
        }

        if (!success) {
            revert(result.getRevertMsg());
        }

        emit Executed(
            msg.sender,
            _destAddress,
            _encodedCalldata,
            _value,
            result
        );

        return result;
    }

    function addOperator(address _address) external onlyOperator(msg.sender) {
        operators[_address] = true;
        emit NewOperator(_address);
    }

    function removeOperator(address _address) external onlyOperator(msg.sender) {
        operators[_address] = false;
        emit OperatorRemoved(_address);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, ERC1155Receiver)
        returns (bool)
    {
        return
            interfaceId == type(ICryptoKeeper).interfaceId ||
            super.supportsInterface(interfaceId);
    }
    
    receive() external payable {}
}
