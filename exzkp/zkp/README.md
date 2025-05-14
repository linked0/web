# Jay’s exmple ZK Dapp

It's from the Artem Chystiakov's post([Introducing Hardhat ZKit](https://medium.com/distributed-lab/introducing-hardhat-zkit-how-did-you-even-use-circom-before-a7b463a5575b)).

## Resources
### Hardhat ZKit github link
https://github.com/dl-solarity/hardhat-zkit

- Hardhat ZKit provides several Hardhat tasks that allow high-level interactions with circuits. zkit:compile compiles the circuits, generating artifacts in the form of r1cs, sym, and wasm files.
- zkit:setup takes the existing artifacts and builds zero knowledge zkey and vkey keys, providing all the required contributions. zkit:verifiers looks for the existing vkeys and exports optimized Solidity verifiers to the contracts directory, maintaining the original circuits naming.

## Run
### Setup
```
npm install
```

### Run zkit make
```
npx hardhat zkit make
```
- Under the hood, Hardhat ZKit will compile the circuit leveraging WASM-based Circom compiler, download the necessary ptau file regarding the number of circuit’s constraints, build the required zkey and vkey files, and generate TypeScript object wrappers to enable full typization of signals and ZK proofs.

- Check `zkit` folder that's generated while compiling.

### Make verifier contract
```
npx hardhat zkit verifiers
```

The generated files will be located in `contracts/verifiers` directory.
```
ls -al contracts/verifiers
```


### Test zk proof
```
npm run test
```