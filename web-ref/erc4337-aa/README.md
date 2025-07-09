Implementation of contracts for [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) account abstraction via alternative mempool.


## How to deploy contracts to localnet
```
nvm use 18
yarn deploy:localnet
```

## Points to check
If this value is set to true, the address of the contract doesn't change.
- `deterministicDeployment: true` in deploy/1_deploy_entrypoint.ts

## Resources

[Vitalik's post on account abstraction without Ethereum protocol changes](https://medium.com/infinitism/erc-4337-account-abstraction-without-ethereum-protocol-changes-d75c9d94dc4a)

[Discord server](http://discord.gg/fbDyENb6Y9)

[Bundler reference implementation](https://github.com/eth-infinitism/bundler)

[Bundler specification test suite](https://github.com/eth-infinitism/bundler-spec-tests)


