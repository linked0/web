# Replay Attack 3

## Intro
The Red Hawks Soccer Club is a passionate soccer team located in an old town.

The Red Hawks team has a group of fans that filled the stadium at every home game.

As the team started to grow in popularity, the club's leadership decided to create a VIP membership program for their most dedicated supporters. 

The program would include exclusive access to special events, merchandise discounts, and other perks.

The club's leadership knew that they wanted to make the VIP membership program special and unique, so they decided to create the membership tickets using non-fungible tokens (NFTs).

This would allow them to create a limited number of VIP membership tickets and give each member a one-of-a-kind, digital collectible.

The membership works by giving vouchers to selected members which they can use to mint NFTs,
Each NFT equals one membership ticket.

There are `180 membership tickets available`.

You are a big fan of The Red Hawks, but membership tickets are too expensive and you can't afford them.

By monitoring the transactions to the `RedHawksVIP.sol` contract, you found the following transaction:

```
Function: mint(uint256 amountOfTickets,string password,bytes signature)

MethodID: mint
[0]:  0000000000000000000000000000000000000000000000000000000000000002
[1]:  000000000000000000000000000000105265644861777352756c7a7a7a313333
[2]: 0x314680f8684d7c555fa6f629b1283300c1cafc6f9215da8808abe72459eedea26767ffc67b49390a9e710141b71548cad0a6bf8256299c2cc171530c991cb6151b
```

Your goal is to steal as many membership tickets as you can, since your family and friends are big fans of The Red Hawks as well ;)

## Accounts
* 0 - Deployer
* 1 - Vouchers Signer
* 2 - User
* 3 - Attacker (You)

<div style="page-break-after: always;"></div>

## Tasks

### Task 1
Steal and claim all the available VIP tickets you can (178), by attacking the `RedHawksVIP.sol` contract.

### Task 2
Protect the `RedHawksVIP.sol` smart contract so your attack won't succeed.