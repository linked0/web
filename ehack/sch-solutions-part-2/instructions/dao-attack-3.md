# DAO Attack 3

## Intro
Blockchain Ventures is a DAO that pools together resources from a community of investors to fund and support the development of promising crypto startups.

Each member of the DAO contributed a certain amount of ETH to the DAO's Treasury, which was then used to fund various crypto startups.

Members of the DAO are able to vote using their DAO tokens on which startups to fund. 

Proposals are evaluated based on their potential for success and alignment with the DAO's mission.

In order for a proposal to pass, it needs to have at least 25% support of the entire voting power (The DAO token supply at the time).

Once a startup was selected, the DAO would provide the necessary funding, along with mentorship and support to help the startup grow.

The DAO members wanted to improve the DAO Token's liquidity, so they decided to deploy a new lending pool offering Flash Loans

### There are 4 smart contracts:
* `DAOToken.sol` - ERC20 Snapshot token of the DAO
* `Treasury.sol` - The treasury of the DAO, funds can be accessed only upon governance vote.
* `Governance.sol` - Governance contract of the DAO, DAO members can suggest, vote, and execute investment.
* `LendingPool.sol` - A lending pool that offers flash loans of the DAO token.

## Accounts
* 0 - Deployer & Owner
* 1 - DAO Member 1
* 2 - DAO Member 2
* 3 - Attacker (You)

## Tasks

### Task 1
Steal all the ETH from the treasury to your Attacker account.