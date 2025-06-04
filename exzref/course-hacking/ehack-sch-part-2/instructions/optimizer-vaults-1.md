# Optimizer Vaults Exercise 1

## Intro

The vast majority of vault systems utilize the [ERC-4626 "Tokenized Vault Standard"](https://ethereum.org/en/developers/docs/standards/tokens/erc-4626/).

ERC-4626 has a known front-running risk when the first deposit is made into the vault.

Our vault system is implemented in the `OptimizerVault.sol` contract found under the `contracts/optimizer-vaults-1/` directory.

A new optimizer vault was just deployed, and the first user (Bob) is about to deposit some USDC tokens to it.
Your goal is to exploit the vault and get some risk-free profit!

## Accounts
* 0 - Deployer
* 1 - Attacker (You)
* 2 - Bob

## Tasks

### Task 1
Exploit the optimizer-vault shares counting system to realize at least $48,000 gain on top of Bob.