# Replay Attack Exercise 2

## Intro
Realty is a fractional and frictionless real estate investing platform. For the first time, investors from around the world can purchase real estate through fully-complimentary, fractional, tokenized ownership. Powered by blockchain.

The `RealtyToken.sol` is an ERC721 token which represents shares in a real estate assets.

The maximum number of shares for an asset is 100 (each share represents 1% of the assets).

Investors can purchase shares through the `RealtySale.sol` contract, every share cost 1 ETH.

A custom share price mechanism exists as well (based on a price oracle), which may be used by the project admin to allow shares to be purchased at a discounted price in certain market conditions.

You've always been interested in real estate investing, and now you can participate in on-chain real estate tokenized investments. But you're broke, and you only have 1 ETH.

Can you buy all the shares with 1 ETH?

## Accounts
* 0 - Deployer & Signer 1
* 1 - User1
* 2 - User2
* 3 - Attacker (You)

## Tasks

### Task 1
Purchase all the available shares of the real estate asset (`RealtyToken.sol`).

### Task 2
Make sure that the Smart Contract `RealtySale.sol` is secured in order to prevent any exploits from taking place.