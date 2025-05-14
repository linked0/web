# circom-starter

A basic circom project using [Hardhat](https://github.com/nomiclabs/hardhat) and [hardhat-circom](https://github.com/projectsophon/hardhat-circom). This combines the multiple steps of the [Circom](https://github.com/iden3/circom) and [SnarkJS](https://github.com/iden3/snarkjs) workflow into your [Hardhat](https://hardhat.org) workflow.

By providing configuration containing your Phase 1 Powers of Tau and circuits, this plugin will:

1. Compile the circuits
2. Apply the final beacon
3. Output your `wasm` and `zkey` files
4. Generate and output a `Verifier.sol`

## Documentation

See the source projects for full documentation and configuration

## Install

`yarn` to install dependencies

## Development builds

`yarn circom:dev` to build deterministic development circuits.

Further, for debugging purposes, you may wish to inspect the intermediate files. This is possible with the `--debug` flag which the `circom:dev` task enables by default. You'll find them (by default) in `artifacts/circom/`

To build a single circuit during development, you can use the `--circuit` CLI parameter. For example, if you make a change to `hash.circom` and you want to _only_ rebuild that, you can run `yarn circom:dev --circuit hash`.

```
yarn circom:dev --circuit simple-polynomial
```

If an error like this happens:
```
Error: /Users/jay/work/web-zkp/circom-starter/artifacts/circom/hermez.s3-eu-west-1.amazonaws.com_powersOfTau28_hez_final_15.ptau: Invalid File format
```
Download from an official mirror and verify the file:
```
curl -O https://storage.googleapis.com/zkevm/powersOfTau28_hez_final_15.ptau
snarkjs powersoftau verify powersOfTau28_hez_final_15.ptau
```

If access denied or other errors downloading the file happens, just generate your own file:
```
snarkjs powersoftau new bn128 15 pot15_0000.ptau -v
snarkjs powersoftau contribute pot15_0000.ptau powersOfTau28_hez_final_15.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 ./powersOfTau28_hez_final_15.ptau ./circuits/powersOfTau28_hez_final_15_phase2.ptau
```

Verify the file:
```
snarkjs powersoftau verify ./powersOfTau28_hez_final_15.ptau

```
## Production builds

`yarn circom:prod` for production builds (using `Date.now()` as entropy)
