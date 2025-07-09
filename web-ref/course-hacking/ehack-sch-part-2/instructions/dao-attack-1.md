# DAO Attack 1

## Intro
"Rainbow Alliance" is a DAO that uses a token for voting and governance. 

There is something wrong with the voting system, can you find the problem?

## Accounts
* 0 - Deployer (Has Voting Power)
* 1 - User 1 (Has Voting Power)
* 2 - User 2 (Has Voting Power)
* 3 - User 3 (Doesn't Have Voting Power)

## Tasks

### Task 1
Execute `npm run dao-attack-1`, all the tests should pass.

### Task 2
There is a major bug in the voting system, which is not detected in the tests, find it.

In the `RainbowAllianceToken.sol` file create an `@audit-issue` comment describing the bug.

### Task 3
Create a PoC (Proof of Concept) in a form of a test, which catches the bug.
The test that you prepare should "fail", since the contract has the bug.