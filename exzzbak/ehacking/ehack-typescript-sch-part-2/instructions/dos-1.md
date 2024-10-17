# Denial Of Service Exercise 1

## Intro
The `TokenSale.sol` is an ICO smart contract, users can invest in the token by sending ETH to the contract, once the sale is over, the admin calls the `distributeTokens()` function and the investors will get the token.
1 ETH = 5 Tokens.
You goal is to break the contract so investors will never be able to get their tokens.

## Accounts
* 0 - Deployer & Owner
* 1 - User1
* 2 - User2 
* 3 - User3
* 4 - Attacker (You)

## Tasks

### Task 1
Break the `TokenSale.sol` so investors won't be able to receive their tokens.

Pro Tip: You can use the `timeout()` function to extend the timeout of Hardhat Tests.
Example: `it('Exploit', async function () {}).timeout(100000000)`