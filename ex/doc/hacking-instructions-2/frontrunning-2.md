# Frontrunning Attacks Exercise 2

## Intro
There is a new lucrative referral program for a DEFI perpetual protocol.

When you refer someone you get from the protocol a comission of 50% from the user's trading fees.

The referral system is implemented using a `Referrals.sol` smart contract.

Can you frontrun users and "steal" their referral code?

## Accounts
* 0 - Deployer & Owner
* 1 - User
* 2 - Attacker (You)

## Tasks

### Task 1
Using Ethers, find a way to listen to the pending transactions that are being sent to the contract.

### Task 2
Find a way to get the transaction data of the pending transaction.

### Task 3
Find a way to frontrun the user's transaction and steal his referral code so it will be yours.

## Useful Link
[Hardhat Mining Modes](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)