# Unchecked Returns Exercise 1

## Intro
DonationMaster is a charity dapp that allows user to create fundraising projects for good causes.

`DonationMaster.sol` is a contract for creating "fundraising Projects", and allowing donators to donate for these projects.

A test file (`tests.js`) contains some test cases for the `DonationMaster.sol` contract.

Someone just created a new donation to a multi-sig wallet.

`MultiSigSafe.sol` is the contract that implements a multi-signature wallet to store ETH in a safely manner, and it supposed to received the eth from the donations.

All the tests should pass if you run `npm run unchecked-returns-1`.

Can we be sure that the contract works properly and securely? Not necessarily.

## Accounts
* 0 - Deployer & Owner
* 1 - User1
* 2 - User2 
* 3 - User3

## Tasks

### Task 1
Find the problem in `DonationMaster.sol`, and implement THE RIGHT TEST under the `Fixed tests` section in the `tests.js` file that will "catch" the bug.

### Task 2
Fix `DonationMaster.sol` and create a secured version without the bug in the `/contracts/unchecked-returns-1/solution` folder, name your contract `DonationMasterSecured.sol`.

### Task 3
There are also some issues with the `MultiSigSafe.sol`, find them, and create a secured version without the bug in the `/contracts/unchecked-returns-1/solution` folder, name your contract `MultiSigSafeSecured.sol`.

### Task 4
Change the `tests.js` file so the tests will work with your secured contracts, and make sure your `Fixed tests` section pass.
