// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "../interfaces/ICallbackContract.sol";

contract TwoStepExchange {
    error OnlyKeeper();
    error InvalidBlockNumber();
    error EmptyOrder();

    struct SwapOrder {
        address account;
        address[] route;
        uint256 amountIn;
        address callbackContract;
        uint256 blockNumber;
    }

    struct PriceParams {
        uint256 price;
        uint256 blockNumber;
    }

    mapping(uint256 => SwapOrder) orders;
    uint256 nonce;
    address keeper;
    uint256 constant CALLBACK_GAS_LIMIT = 2_000_000;

    event CallbackFailed(uint256 id, string revertMessage, bytes revertData);
    event SwapOrderExecuted(uint256 id, uint256 price);
    event RevertMessageUnparsable(bytes data);
    event ParsedMessage(string message, bytes data);

    constructor() {
        keeper = msg.sender;
    }

    function createSwapOrder(
        address[] calldata _route,
        uint256 _amountIn,
        address _callbackContract
    ) external {
        orders[++nonce] = SwapOrder({
            account: msg.sender,
            route: _route,
            amountIn: _amountIn,
            callbackContract: _callbackContract,
            blockNumber: block.number
        });
    }

    function executeSwapOrder(
        uint256 _id,
        PriceParams calldata params
    ) external {
        if (msg.sender != keeper) revert OnlyKeeper();
        SwapOrder memory order = orders[_id];

        if (order.account == address(0)) revert EmptyOrder();
        if (params.blockNumber != order.blockNumber)
            revert InvalidBlockNumber();

        try
            ICallbackContract(order.callbackContract).beforeExecution{
                gas: CALLBACK_GAS_LIMIT
            }()
        {} catch (bytes memory _revertData) {
            string memory revertMessage = getRevertMessage(_revertData);
            emit CallbackFailed(_id, revertMessage, _revertData);
        }

        /** Execute the swap order at the provided price **/
        /** ... **/

        delete orders[_id];

        emit SwapOrderExecuted(_id, params.price);
    }

    function getRevertMessage(
        bytes memory result
    ) internal returns (string memory) {
        string memory parsed = "";
        bytes32 errorSelector;

        assembly {
            errorSelector := mload(add(result, 0x20))
        }

        if (errorSelector == bytes4(0x08c379a0)) {
            // Selector for Error(String)
            assembly {
                result := add(result, 0x04)
            }

            parsed = (abi.decode(result, (string)));
            emit ParsedMessage(parsed, result);
        } else emit RevertMessageUnparsable(result);

        return parsed;
    }
}
