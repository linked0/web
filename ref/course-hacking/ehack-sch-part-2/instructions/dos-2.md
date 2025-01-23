# Denial Of Service Exercise 2

## Intro
The `Auction.sol` is an auction contract where people can bid on an item, everytime someone bids higher amount than the previous bidder, he becomes the new `currentLead`, and the previous bid is being refunded to the previous highest bigger.
Can you exploit the contract and make sure that no one can bid after you?

## Accounts
* 0 - Deployer & Owner
* 1 - User1
* 2 - User2
* 3 - Attacker (You)

## Tasks

### Task 1
Hack the smart contract and make sure that you are the highest bidder and no one else is able to bid after you.