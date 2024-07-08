# Flash Loans Exercise 3

## Intro
Your goal in this exercise is to execute successfully an [Uniswap V2 Flash Swap](https://docs.uniswap.org/protocol/V2/guides/smart-contract-integration/using-flash-swaps).

**Note: This exercise is executed on an Ethereum mainnet Fork block number `15969633`.**

## Ethereum MAINNET Addresses
```
USDC: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

Uniswap V2 USDC-WETH Pair: 0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc

Impersonated Account: 0x8e5dedeaeb2ec54d0508973a0fccd1754586974a
```

## Tasks

### Task 1
Implement the `executeFlashSwap` and `uniswapV2Call` functions inside the `FlashSwap.sol` smart contract.

`executeFlashSwap`  - receives a token and an amount and execute a flash swap.

`uniswapV2Call` - the "callback" function, will be called from Uniswap V2 pair contract.

Use the [Solidity Hardhat `console.log` command](https://hardhat.org/tutorial/debugging-with-hardhat-network) to log the following params:
1. Contract's token balance before the flash swap.
2. Contract's token balance during the flash swap.
3. Flash swap fee.

### Task 2
In the `tests.js` complete all the open TODOs

Make sure to [impersonate the account](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#impersonating-accounts) that is mentioned in the addresses section so you have enough USDC to send to your `FlashSwap.sol` contract (for fees).