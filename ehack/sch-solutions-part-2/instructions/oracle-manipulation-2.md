# Oracle Manipulation 2

## Intro
Lendly is a decentralized lending protocol that allows users to deposit and borrow tokens based on their collateral

Lendly is safe and overcollateralized, the maximum LTV for a user is 66%.

Lendly currently supports `DAI` and `WETH` tokens, and currently it has 180 ETH and 270,000 DAI (~$0.5M TVL).

Your goal is to drain the majority of Lendly funds.

**Note: This exercise is executed on an Ethereum mainnet Fork block number `15969633`. Everything is already configured in the `hardhat.config.js` file**

## Ethereum MAINNET Addresses
```
WETH Token: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
DAI Token: 0x6B175474E89094C44Da98b954EedeAC495271d0F
Uniswap V2 DAI-WETH Pair: 0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11

Impersonated Account (Whale / Binance Hot Wallet): 0xf977814e90da44bfa03b6295a0616a897441acec
```

## Accounts
* 0 - Deployer & Owner
* 1 - Attacker (You)

## Tasks

### Task 1
Drain at least 88% of the protocol funds.