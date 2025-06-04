# DEFI Crash Course: DEX Exercise 1 - Chocolate Factory

## Intro
This exercise will get you working with the Uniswap V2 Factory and Router Smart Contracts.

You will deploy a new token, create a pair for it with ETH, and create helper functions to add / remove liquidity and swap tokens.

Eventually, you'll have to write some tests to make sure everything works.

**Note: This exercise is executed on an Ethereum mainnet Fork block number `15969633`.Everything is already configured in the `hardhat.config.js` file**

## Ethereum MAINNET Addresses
* Uniswap V2 Router: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
* WETH Token: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

## Accounts
* 0 - Deployer
* 1 - User

## Tasks

### Task 1 - Contract Creation
Complete all the open TODOs in `Chocolate.sol`.

* Upon token construction, create a pair for your token with WETH using the Uniswap V2 Factory.
* Complete the `addChocolateLiquidity` admin-only function, and add the liquidity using the Uniswap V2 router.
The function will send the LP tokens to the smart contract owner.
* Complete the `removeChocolateLiquidity` admin-only function, and remove the liquidity using the Uniswap V2 router.
The function will send the tokens to the smart contract owner.
* Complete the `swapChocolate` user's function, and swap the tokens using the Uniswap V2 router.
The function will send the tokens to the user who swapped the tokens.

### Task 2 - Tests
Complete all the open TODOs in `test/dex-1/tests.js`
#### Deployment
* Deploy the chocolate smart contract
* Get the newly deployed pair address, and print it using `console.log`
* Load and store the pair smart contract
#### Deployer Adds Liquidity
* Using your contract, add liquidity for Choclate & ETH
* Print the amount of LP tokens the deployer owns
#### User Swapping
* From the user account, swap 10 ETH to chocolates
* Make sure the swap succeded by comparing the before and after balances
* From the user account, swap 100 chocolates to ETH
* Make sure the swap succeded by comparing the before and after balances
#### Deployer Removes Liquidity
* Using your contract, remove 50% of the deployer's liquidity
* Make sure deployer owns 50% of the LP tokens (leftovers) 
* Make sure deployer got chocolates and WETH back (greater amount than before)