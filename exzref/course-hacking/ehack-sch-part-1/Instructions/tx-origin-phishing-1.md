# Tx.Origin Phishing Exercise 1

## Intro
There is a super rich hedge fund that uses a smart wallet contract to manage some of their assets.

Yesterday you noticed that one of the fund's managers transferred 2800 ETH from their Binance Account to their smart wallet.

Assuming you can trick this fund manager to donate 0.1 ETH to his favorite charity, 
can you somehow hack this smart wallet and drain all the ETH?

## Accounts
* 0 - Fund Manager
* 1 - Attacker (You)

## Tasks

### Task 1
Exploit the `SimpleSmartWallet.sol` and steal all the funds (you can assume that the phishing attack will succeed).

### Task 2
Protect the `SimpleSmartWallet.sol` smart contract so your attack wouldn't succeed.