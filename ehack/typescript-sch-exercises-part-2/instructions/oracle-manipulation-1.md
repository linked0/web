# Oracle Manipulation 1

## Intro
SynthGold is a new synthetic assets derivatives protocol that allows users to trade on-chain synthetic gold tokenized asset.

The protocol uses a special off-chain oracle service to determine the gold price at any moment.

The gold price is based on three trusted Oracle sources:
```
0x4aC89064Fa0d03De57f802feC722925b4502572A
0x96574c0392112CbEe134eb77e76A183d54A7c18f
0xA7804BB057EBB7D0c0a3C7F4B8710AE854525fd4
```

Anyone can buy or sell gold from and to the exchange based on the Oracle price.

When a user buys gold from the exchange, gold tokens are minted.

When a user sells gold to the exchange, gold tokens are burned.

Recently, you managed to get your hands on a password protected zip file (`leaked.zip`) that belongs to the exchange developer, that might be helpful ;)

You (attacker) start with 1 ETH in balance.

## Accounts
* 0 - Exchange Deployer
* 1 - Attacker (You)

## Tasks

### Task 1
Steal all the ETH reserves from the SynthGold exchange to your attacker EOA account.