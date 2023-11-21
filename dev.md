
Table of Contents
- [Dev](#dev)
    - [create2](#create2-함수)
    - [clique](#clique-in-genesisjson)


# Dev
## create2 함수
아래 함수는 UniswapV2Factory에서 사용되는 코드임

```solidity
bytes memory bytecode = type(UniswapV2Pair).creationCode;
bytes32 salt = keccak256(abi.encodePacked(token0, token1));
assembly {
    pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
}
```

Unlike create, which generates the contract address based on the address of the creator and how many contracts it has created (nonce), create2 generates the address using the creator's address, a provided salt, and the hash of the initialization code. This allows for predictable computation of the contract's address before the contract is actually deployed.

- Endowment (0): This is the amount of Ether, in wei, that is sent to the new contract upon creation. In this case, it's set to 0, meaning no Ether is sent.

- Memory Start (add(bytecode, 32)):
bytecode is the initialization code for the contract you want to create. In Solidity, contract bytecode is often stored in an array, and this array includes a 32-byte length prefix.
add(bytecode, 32) calculates the starting point of the actual bytecode, skipping the first 32 bytes which represent the length of the bytecode. This is necessary because create2 requires a pointer to the start of the actual code, not the length prefix.
Size of Code (mload(bytecode)):

- mload(bytecode) is used to load the first 32 bytes of bytecode, which, as mentioned, contain its size. This tells create2 how much of the memory starting from add(bytecode, 32) it should read and use as the initialization code.
Salt (salt):

- The salt is a 32-byte value that you provide. It's part of the formula used to calculate the address of the new contract.
In your code, salt is generated from the hash of two token addresses, which helps ensure that each pair of tokens gets a unique contract address.


## clique in genesis.json
```json
{
  "config": {
    "chainId": 12301,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "arrowglacierBlock": 0,
    "clique": {
      "period": 1,
      "epoch": 30000
    }
  },
  ...
}
```
- "period":
This refers to the block time, the time interval between consecutive blocks. In this case, 1 means one second. This is a very fast block time, suitable for private or test networks where quick consensus is desired. In public networks, such short intervals could lead to network instability due to propagation delays and increased likelihood of forks.

- "epoch":
The epoch length, set here as 30000, is significant in Clique PoA. An epoch is a period after which the list of authorized signers can be updated. In Clique, every epoch blocks, a special block called the epoch transition block is generated, which contains the list of authorized signers for the next epoch. The number 30000 means that every 30,000 blocks, the network has an opportunity to update the list of signers.

## Node workspaces
##### Structure and Configuration
- Workspace Root: A single workspace has a root directory, usually with a package.json file that includes a workspaces field.
- Sub-packages: Inside the root, there are subdirectories for each workspace, each with its own package.json file.
- Shared Configuration: Dependencies and scripts can be shared across workspaces, which is especially useful for common configurations and shared libraries.

###### Reference Project
[poohgithub zksync-era](https://github.com/poohgithub/zksync-era)
[mater-labs pymaster-examples](https://github.com/matter-labs/paymaster-examples)