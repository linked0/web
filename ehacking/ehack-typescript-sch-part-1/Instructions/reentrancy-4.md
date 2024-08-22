# Reentrancy Exercise 4

## Intro
CryptoEmpire NFTs is an on-chain gaming protocol that allows users to buy, sell, and stake CryptoEmpire NFTs (ERC1155) in a secure and decentralized manner. 

There are 2 main smart contracts:

`CryptoEmpireToken.sol` - The CryptoEmpire ERC1155 token.

`CryptoEmpireGame.sol` - The contract that enables users to trade their CryptoEmpire tokens with other users, stake them, and ustake them.

The game contains 6 game items (NFTs), each with a different TokenId.

You were able to receive 1 item (tokenId 2).

Can you find a bug in the contracts and steal ALL the items (NFTs) with the same tokenId that you own?

## Accounts
* Deployer
* User1 
* User2
* Attacker(You)

## Tasks

### Task 1
The game contract has a total of 120 NFTs (6 different TokenIds * 20). 

Find a way to steal all the items of TokenId 2 (the one that you own) from the game.