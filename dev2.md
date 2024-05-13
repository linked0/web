🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※
# Jay's code sneppets

**latest forge**
```
yarn cache clean --force

vm.expectRever(
  abi.encodeWithSelector(
    Raffle.Raffle__UpkeepNotNeeded.selector,
      ...
    )
} 

vm.recordLogs();
Vm.Log[] memory entries = vm.getRecordedLogs();

forge sanpshot -m testWithrawFromMultipleFunders
```

```
vm.txGasPrice(GAS_PRICE);
uint256 gasStart = gasleft();

uint256 gasEnd = gasleft();
uint256 gasUsed = (gasStart - gasEnd) * tx.gasprice;
```

```
forge inspect FundMe storageLayout
cast storage 0x...(Contract address) 써보기
cast --to-wei 15
cast balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
배포 스크립트 실행시에는 --broadcast를 써야 함.

cast --calldata-decode "fund()" 0xa7ea5e4e

파이선 인터프러터 모드 같은 것.
chisel - Test and receive verbose feedback on Solidity inputs within a REPL environment.
```

**latest hardhat**

**기타: reset array 등**

```
uint16 타입도 있음.

constructor (..., vrfCoordinator, ...) VRFConsumerBaseV2(vrfCoordinator) {
...
}

% 연산자도 있음.

address payable winner = s_players[indexOfWinner];

resetting!
s_players = new address payable[](0);

event WinnerPicked(address indexed winner);
This allows these parameters to be searchable when looking through the blockchain logs. 
```

**abi.decode**
```
function addPerson(bytes calldata data) external {
    // Assuming `data` is ABI-encoded with (string, uint8)
    (string memory name, uint8 age) = abi.decode(data, (string, uint8));

    // Store the information in the contract's state
    people[msg.sender] = Person(name, age);

    // Emit an event to log the addition
    emit PersonAdded(msg.sender, name, age);
}
```

**slot.value**
```
function upgrade(address implementation_) external virtual {
    require(_isValidSigner(msg.sender), "Caller is not owner");
    require(implementation_ != address(0), "Invalid implementation address");
    ++state;
    StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = implementation_;
}
```

**Promise.all && map**
```
await Promise.all(Array.from({ length: 14 }, (_, i) => i).map((i) => claimTopicsRegistry.addClaimTopic(i)));
```

**signMessage**
```
// 이건 ethers v5용이라 참고용
claimForBob.signature = await claimIssuerSigningKey.signMessage(
  ethers.utils.arrayify(
    ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(['address', 'uint256', 'bytes'], [claimForBob.identity, claimForBob.topic, claimForBob.data]),
    ),
  ),
);

// ethers v6
const signature = await signer.signMessage(
  ethers.toBeArray(
    ethers.solidityPackedKeccak256(
      ["bytes32", "address", "uint256"],
      [
        SIGNATURE_DELEGATION_HASH_TYPE,
        delegates[index]!.address,
        endTimestamp,
      ],
    ),
  ),
);
```

**참고할 내용 많음**
```
function cheaperWithdraw() public onlyOwner {
    address[] memory funders = s_funders;
    // mappings can't be in memory, sorry!
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
        address funder = funders[funderIndex];
        s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    // payable(msg.sender).transfer(address(this).balance);
    (bool success,) = i_owner.call{value: address(this).balance}("");
    require(success);
}
```

**CALLDATA**
```
CALLDATACOPY(t, f, s): msg.data 의 f번째 위치에서 s개의 바이트를 읽어 메모리의 t번째 위치에 저장합니다.
create2(
  callvalue(), // wei sent with current call
  // Actual code starts after skipping the first 32 bytes
  add(bytecode, 0x20),
  (bytecode), // Load the size of code contained in the first 32 bytes
   _salt // Salt from function arguments
)
```

**Make sure that we can transfer out token 200**
```
vm.prank(owner4);
IERC6551Executable(account4).execute(
    address(account3),
    0,
    abi.encodeWithSignature(
        "execute(address,uint256,bytes,uint8)",
        address(nft),
        0,
        abi.encodeWithSignature(
            "safeTransferFrom(address,address,uint256)", account3, newTokenOwner, 200
        ),
        0
    ),
    0
);

function callTransfer(address _token, address _to, uint256 _amount) external {
    // This will encode the function call to `transfer(address,uint256)` with the specified arguments
    bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", _to, _amount);
    // Making the actual call to the token contract's transfer function
    (bool success, ) = _token.call(data);
    require(success, "Transfer failed");
}
```

**Nick's Factory**
```
The registry MUST be deployed at address 0x000000006551c19487814612e58FE06813775758 using Nick’s Factory (0x4e59b44847b379578588920cA78FbF26c0B4956C) with salt 0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31.
The registry can be deployed to any EVM-compatible chain using the following transaction:

{
        "to": "0x4e59b44847b379578588920ca78fbf26c0b4956c",
        "value": "0x0",
        "data": "0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31608060405234801561001057600080fd5b5061023b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063246a00211461003b5780638a54c52f1461006a575b600080fd5b61004e6100493660046101b7565b61007d565b6040516001600160a01b03909116815260200160405180910390f35b61004e6100783660046101b7565b6100e1565b600060806024608c376e5af43d82803e903d91602b57fd5bf3606c5285605d52733d60ad80600a3d3981f3363d3d373d3d3d363d7360495260ff60005360b76055206035523060601b60015284601552605560002060601b60601c60005260206000f35b600060806024608c376e5af43d82803e903d91602b57fd5bf3606c5285605d52733d60ad80600a3d3981f3363d3d373d3d3d363d7360495260ff60005360b76055206035523060601b600152846015526055600020803b61018b578560b760556000f580610157576320188a596000526004601cfd5b80606c52508284887f79f19b3655ee38b1ce526556b7731a20c8f218fbda4a3990b6cc4172fdf887226060606ca46020606cf35b8060601b60601c60005260206000f35b80356001600160a01b03811681146101b257600080fd5b919050565b600080600080600060a086880312156101cf57600080fd5b6101d88661019b565b945060208601359350604086013592506101f46060870161019b565b94979396509194608001359291505056fea2646970667358221220ea2fe53af507453c64dd7c1db05549fa47a298dfb825d6d11e1689856135f16764736f6c63430008110033",
}
```

**assembly 구조**
```
# Asssembly 구조
// Memory Layout:
// ----
// 0x00   0xff                           (1 byte)
// 0x01   registry (address)             (20 bytes)
// 0x15   salt (bytes32)                 (32 bytes)
// 0x35   Bytecode Hash (bytes32)        (32 bytes)
// ----
// 0x55   ERC-1167 Constructor + Header  (20 bytes)
// 0x69   implementation (address)       (20 bytes)
// 0x5D   ERC-1167 Footer                (15 bytes)
// 0x8C   salt (uint256)                 (32 bytes)
// 0xAC   chainId (uint256)              (32 bytes)
// 0xCC   tokenContract (address)        (32 bytes)
// 0xEC   tokenId (uint256)              (32 bytes)

// Silence unused variable warnings
pop(chainId)

// Copy bytecode + constant data to memory
calldatacopy(0x8c, 0x24, 0x80) // salt, chainId, tokenContract, tokenId
mstore(0x6c, 0x5af43d82803e903d91602b57fd5bf3) // ERC-1167 footer
mstore(0x5d, implementation) // implementation
mstore(0x49, 0x3d60ad80600a3d3981f3363d3d373d3d3d363d73) // ERC-1167 constructor + header

// Copy create2 computation data to memory
mstore8(0x00, 0xff) // 0xFF
mstore(0x35, keccak256(0x55, 0xb7)) // keccak256(bytecode)
mstore(0x01, shl(96, address())) // registry address
mstore(0x15, salt) // salt

// Compute account address
let computed := keccak256(0x00, 0x55)

// If the account has not yet been deployed
if iszero(extcodesize(computed)) {
    // Deploy account contract
    let deployed := create2(0, 0x55, 0xb7, salt)

    // Revert if the deployment fails
    if iszero(deployed) {
        mstore(0x00, 0x20188a59) // `AccountCreationFailed()`
        revert(0x1c, 0x04)
    }

    // Store account address in memory before salt and chainId
    mstore(0x6c, deployed)

    // Emit the ERC6551AccountCreated event
    log4(
        0x6c,
        0x60,
        // `ERC6551AccountCreated(address,address,bytes32,uint256,address,uint256)`
        0x79f19b3655ee38b1ce526556b7731a20c8f218fbda4a3990b6cc4172fdf88722,
        implementation,
        tokenContract,
        tokenId
    )

    // Return the account address
    return(0x6c, 0x20)
}

// Otherwise, return the computed account address
mstore(0x00, shr(96, shl(96, computed)))
return(0x00, 0x20)

```
---
- 일단 깃헙 커밋 메시지는 대문자로 하기
---
- PR은 Motivation과 Solution으로 나누어 기술하기 
  - 참고: https://github.com/erc6900/reference-implementation/pull/52
---
- 코드
```
(address signer, ECDSA.RecoverError err) =
    userOpHash.toEthSignedMessageHash().tryRecover(userOp.signature);
if (err != ECDSA.RecoverError.NoError) {
    revert InvalidSignature();
}
```
---
- sol 파일 함수 설명
```
/// @title Base Session Key Plugin
/// @author Decipher ERC-6900 Team
/// @notice This plugin allows some designated EOA or smart contract to temporarily
/// own a modular account.
/// This base session key plugin acts as a 'parent plugin' for all specific session
/// keys. Using dependency, this plugin can be thought as a proxy contract that stores
/// session key duration information, but with validation functions for session keys.
///
/// It allows for session key owners to access MSCA both through user operation and 
/// runtime, with its own validation functions.
```

```
/// @notice Route call to executeFromPluginExternal at the MSCA.
    /// @dev This function will call with value = 0, since sending ether 
    /// for ERC20 contract is not a normal case.
    /// @param target The target address to execute the call on.
    /// @param data The call data to execute.
```


요것도 괜찮네: 
https://github.com/erc6900/reference-implementation/pull/22/commits/0fb2113a0f1b09e8eeef72dd6d04b04bbc0151a8
```
​​    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```


```
/// @inheritdoc ISessionKeyPlugin
function addTemporaryOwner(address tempOwner, uint48 _after, uint48 _until) external {
```
---
- supportsInterface
```
function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
    return interfaceId == type(ISessionKeyPlugin).interfaceId || super.supportsInterface(interfaceId);
}
```
---
- storage modifier: EnumerableSet.Bytes32Set storage sessionKeySet = _sessionKeySet[msg.sender];
Purpose: This line declares a variable sessionKeySet that refers to a set of session keys for the message sender (msg.sender). The storage modifier indicates that sessionKeySet is a pointer to the data located in the contract's persistent storage, not a temporary copy. This is crucial in Solidity because changes to a storage variable directly modify the state on the blockchain.
---
- unchecked block: 
The unchecked block is used here to tell the compiler not to check for overflows when incrementing the index i. This can save gas since the overflow is unlikely given the controlled environment of the loop (i.e., looping over an array length
---
- transient storage sample:
https://solidity-by-example.org/transient-storage/
---
forge create

npx hardhat node  // 꼭 hardhat 프로젝트 폴더에서 진행해야함.

forge script script/DeployTransactionDelegator.s.sol --rpc-url $LOCALNET_RPC_URL

---
**CREATE a CONTRACT with 2 SAME addresses on 2 DIFFERENT chains**

address = bytes20(keccak256(0xFF, senderAddress, salt, bytecode))

How to deploy my contract on 2 different chains with the same address?
Now, let’s answer to the question: How to deploy a smart contract with the same addresses in 2 different chains?

You can do it with the CREATE2 opcode by providing the same salt on different chains. (easier than providing the nonce because you can’t fully control it)

[here](https://trustchain.medium.com/create-a-contract-with-2-same-addresses-on-2-different-chains-3ed987b1e348)

---
foundry remapping은 toml에서 지정함.

tokenURI 함수, ERC721

forge init –force 
forge install https://github.com/OpenZeppelin/openzeppelin-contracts@v4.9.3