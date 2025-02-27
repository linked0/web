# Flash Loans Exercise 2

## Intro
Your goal in this exercise is to take a [flash loan on AAVE V3](https://docs.aave.com/developers/guides/flash-loans).

**Note: This exercise is executed on an Ethereum mainnet Fork block number `15969633`.**

## Ethereum MAINNET Addresses
```
USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

AAVE Lending Pool: 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9

Impersonated Account: 0x8e5dedeaeb2ec54d0508973a0fccd1754586974a
```

## Tasks

### Task 1
Implement the `getFlashLoan` and `executeOperation` functions inside the `FlashLoan.sol` smart contract.

`getFlashLoan`  - receive a token address and amount, and executes a flash loan.

`executeOperation` - the "callback" function, will be called from AAVE's contract.

Use the [Solidity Hardhat `console.log` command](https://hardhat.org/tutorial/debugging-with-hardhat-network) to log the following params:
1. Contract's token balance before the flash loan.
2. Contract's token balance during the flash loan.
3. Flash loan fee (that is being sent from AAVE contract's callback).

### Task 2
In the `tests.js` complete all the open TODOs

Important: make sure to [impersonate the account](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#impersonating-accounts) that is mentioned in the addresses section so you have enough USDC to pay the flash loan fees.