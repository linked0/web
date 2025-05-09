// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IAllBasic.sol";
import "./AllBasicFriend.sol";
import "./ILock.sol";
import "./Lock.sol";
import {_revertInvalidMsgValue} from "./AllBasicErrors.sol";

// Uncomment this line to use console.log
// import {console} from "hardhat/console.sol";

// 코딩 참고 컨트랙트
//Users/hyunjaelee/work/account-abstraction/contracts/samples/SimpleAccount.sol
//Users/hyunjaelee/work/erc6900-reference/src/samples/plugins/ModularSessionKeyPlugin.sol

// @audit-issue Should emit event
contract AllBasic is IAllBasic {
  uint public value = 1;
  uint public lastCallNonce;
  mapping(address => bool) public approvals;
  mapping(address => bool) public spenders;
  Lock public lock;
  Lock public lock2;
  address public friend;
  uint256 constant BasicOrder_receivedItemByteMap = (
    0x0000010102030000000000000000000000000000000000000000000000000000
  );

  error InvalidMsgValue(uint256 value);

  struct Message {
    address from;
    string content;
  }

  bytes32 public constant MESSAGE_TYPEHASH =
    keccak256("Message(address from,string content)");
  bytes32 public DOMAIN_SEPARATOR;

  constructor() payable {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256(
          "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        ),
        keccak256(bytes("MyDApp")),
        keccak256(bytes("1")),
        chainId,
        address(this)
      )
    );
  }

  function createLock() public {
    lock = new Lock(block.timestamp + 100);
    lock.setLockTime(1);
  }

  function createLockCreationCode() public {
    bytes memory bytecode = abi.encodePacked(
      type(Lock).creationCode,
      abi.encode(block.timestamp + 100)
    );
    bytes32 salt = keccak256(abi.encodePacked(block.timestamp));
    address newLock;
    assembly {
      newLock := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    lock2 = Lock(newLock);
    lock2.setLockTime(2);
  }

  function getLockTime() public view returns (uint, uint) {
    uint time;
    uint time2;
    if (address(lock) != address(0)) time = lock.getUnlockTime();
    if (address(lock2) != address(0)) time2 = lock2.getUnlockTime();
    return (time, time2);
  }

  function add() public {
    value += 1;
  }

  function getValue() external view returns (uint) {
    return value;
  }

  function approve(address owner, address spender) public {
    approvals[owner] = true;
    spenders[spender] = true;
  }

  function simulateValidation(
    PackedUserOperation calldata _userOp
  ) external override returns (ValidationResult memory) {
    ValidationResult memory result;
    result.returnInfo = ReturnInfo(0, 0);
    result.senderInfo = StakeInfo(1, 1);
    lastCallNonce = _userOp.nonce;
    return result;
  }

  function calculatePower(uint x, uint y) external returns (uint) {
    value = x ** y;
    return value;
  }

  function setFriend(address _friend) public {
    friend = _friend;
  }

  function callFriendWithSignature(
    uint256 _value,
    string memory _message
  ) public {
    bytes memory data = abi.encodeWithSignature(
      "setValues(uint256,string)",
      _value,
      _message
    );
    (bool success, ) = friend.call(data);
    require(success, "Call to Friend failed");
  }

  function callFriendWithSelector(
    uint256 _value,
    string memory _message
  ) public {
    bytes4 selector = bytes4(keccak256("setValues(uint256,string)"));
    bytes memory data = abi.encodeWithSelector(selector, _value, _message);
    (bool success, ) = friend.call(data);
    require(success, "Call to Friend failed");
  }

  // Example function to encode some data
  function encodeData(
    uint256 number,
    string memory text
  ) public pure returns (bytes memory) {
    return abi.encode(number, text);
  }

  // Example function to decode the data
  function decodeData(
    bytes memory data
  ) public pure returns (uint256 number, string memory text) {
    (number, text) = abi.decode(data, (uint256, string));
  }

  // Example of ByteMap
  // NOTE: Never use bytes1 type for receivedItemType!!!
  function getByte(uint256 index) public pure returns (bytes1) {
    uint8 receivedItemType;
    assembly {
      receivedItemType := byte(index, BasicOrder_receivedItemByteMap)
    }
    return bytes1(receivedItemType);
  }

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃    EIP-712 functions      ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

  function hashMessage(Message memory message) public pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          MESSAGE_TYPEHASH,
          message.from,
          keccak256(bytes(message.content))
        )
      );
  }

  function verify(
    address signer,
    Message memory message,
    bytes memory signature
  ) public view returns (bool) {
    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hashMessage(message))
    );
    (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
    return ecrecover(digest, v, r, s) == signer;
  }

  function splitSignature(
    bytes memory sig
  ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
    require(sig.length == 65, "invalid signature length");
    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := byte(0, mload(add(sig, 96)))
    }
  }

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃            ETC            ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  function revertNowhere() public payable {
    _revertInvalidMsgValue(msg.value);
  }
}
