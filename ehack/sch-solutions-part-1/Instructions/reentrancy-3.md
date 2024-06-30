# Reentrancy Exercise 3

## Intro

Alice is an experienced blockchain developer and she developed numerous DEFI applications for various companies during the years.

But, she had always wanted to create something of her own.

Alice decided to create her own DEFI lending protocol called **ChainLend**.
She began by allowing only one token for depositing (`imBTC`) and one token for borrowing (`USDC`).

She knew that if her product was successful, it could revolutionize how people borrow and deposit money.

After several months of dedicated work, ChainLend was launched.

Thousands of people around the world began using her product, and she was delighted by its success.

Her core contract, however, contains a vulnerability that she is unaware of, could you find it and hack ChainLend?

In this challenge:
* ChainLend has 1 Million USDC in it
* You (the attacker), own only 1 imBTC 😭

Additionally, assume that the correct prices and Oracles are in place to determine the correct borrowing limit.

In order to simplify matters, the imBTC Oracle price is set at 20,000 USDC per imBTC.

**Note: This exercise is executed on an Ethereum mainnet Fork block number `15969633`. Everything is already configured in the `hardhat.config.js` file**

## Accounts
* 0 - Deployer (Alice)
* 1 - Attacker (You)

## Tasks

### Task 1
Find a way to hack ChainLend and drain the whole USDC pool.