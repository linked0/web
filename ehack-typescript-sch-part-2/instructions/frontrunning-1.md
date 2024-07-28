# Frontrunning Attacks Exercise 1

## Intro
Arrr, I am the most infamous pirate on the seven seas, Captain Blackbeard at yer service!

I made this contract so I could hide a solution string somewhere in the world and the first person to find it gets the treasure of 10 ethers.

All they have to do is use the `claim()` function with the correct solution and they'll be rewarded. 

Any swabber who tries to cheat and guess the wrong solution will be told they are wrong and their ether will be forfeited.

Start sailing and searching for that solution if you want to claim the treasure!

```
It looks like a pirate wrote this contract for a treasure hunt game where the first person to find the hidden solution string can claim a reward of 10 ether using the claim() function. 
Can you find the secret answer and claim the prize?
```

## Accounts
* 0 - Deployer
* 1 - User
* 2 - Attacker (You)

## Tasks

### Task 1
Using Ethers, find a way to listen to the pending transactions that are being sent to the contract

### Task 2
Find the vulnerable transaction

### Task 3
Find a way to frontrun the user's transaction and steal his reward so it will be yours

## Useful Link
[Hardhat Mining Modes](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)