# Mint an NFT if you know a secret

Developed for 0xPARC.

Contract on Goerli: [`0xc4490d6407f81378c8d3620eA11092B2FC429Df2`](https://goerli.etherscan.io/address/0xc4490d6407f81378c8d3620eA11092B2FC429Df2)

## Getting started
### Environment
#### Python environment

If you're doing Web3 or dev work seriously, just install pyenv and never look back:
```
brew install pyenv
```

Add to your shell config (~/.zshrc, ~/.bashrc, etc.):
```
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
```

Restart your shell or source ~/.zshrc, then:
```
pyenv install 3.10
pyenv local 3.10.17
python --version
```

Now you're in Python 3.11 inside your project directory, and you can do:
```
python -m venv .venv
source .venv/bin/activate
```
And life becomes marginally less painful.

**These should be done including `source .venv/bin/activate` for next steps**

#### Use node v16
```
nvm install 16
nvm use 16
```

#### For circom helper
Without these intallations, errors happens while generating cpp files.
```
brew install nlohmann-json
brew install nasm
```

You can check the r1cs file with the following command.
```
npx snarkjs r1cs info build/test/NftMint_test.r1cs
```

#### Other dependencies
```
brew install wget
```

### How to Test
1. Run circom-helper in `circuits` folder
  ```
  npm run circom-helper
  ```

2. Run test in `circuits` folder on other terminal
  ```
  npm run test 
  ```

3. zkey-manager-compile
  ```
  cp -r zkeys zkeys.bak2 // if there are already zkeys
  npm run zkey-manager-compile
  ```

  If there occurs an error like this:
  ```
  /bin/sh: ../../.cargo/bin/circom: No such file or directory
  ```

  Change the `circum` binary path in zkeys.config.yml:
  ```
  circomPath: "../../../../.cargo/bin/circom"
  ```

4. zkey-manager-downloadPtau
   ```
   npm run zkey-manager-downloadPtau
   ```
   If there is no ptau file on the server, just copy a phase 2 ptau file from another project when running a local test program.

5. zkey-manager-genZkeys
   ```
   npm run zkey-manager-genZkeys
   ```

5. export-verifier-sol
   ```
   npm run build
   npm run export-verifiler-sol
   ```

### How to Run
Clone this repository and install dependencies:
**Don't use yarn**

```bash
git clone git@github.com:weijiekoh/zknftmint.git
cd zknftmint
npm i
npm run bootstrap
```

You may need to manually install dependencies for `zkey-manager` by following instructions [here](https://github.com/privacy-scaling-explorations/zkey-manager#requirements).

In a separate terminal, run a HTTP server in `web/zkeys`:

```bash
cd web/zkeys
npx http-server --cors -p 8000
```

In another terminal, run the web application:

```bash
cd web
npm run serve
```

Get Goerli ETH: https://faucet.paradigm.xyz/

To generate a proof and nullifier, first navigate to:

http://127.0.0.1:1234

Next, paste your ETH address from Metamask and enter the secret (currently
hardcoded to `1234`). Click "Create proof".

Navigate to the Write Contract page for the NftMint contract on Etherscan,
click on "Connect to Web3", and select `mintWithProof`. Copy and paste the
nullifier and the proof, and click "Write".

https://goerli.etherscan.io/address/0xc4490d6407f81378c8d3620eA11092B2FC429Df2#writeContract

If the proof is valid and you have not previously used this address to mint an
NFT on this contract, the transaction will execute and mint an NFT to your
address.

## Development

To install NPM dependencies, run this in the project's root directory:

```
npm i && npm run bootstrap
```

To compile the Typescript code for tests, run:

```
npm run build
```

To compile the circuits, generate its zkey file, and export its verification
key for off-chain proof verification:

```
cd circuits
npx zkey-manager compile -c ./zkeys.config.yml
npx zkey-manager downloadPtau -c ./zkeys.config.yml
npx zkey-manager genZkeys -c ./zkeys.config.yml
npx snarkjs zkev ./NftMint__prod.0.zkey ./zkeys/verification_key.json
node build/exportVerifier.js ./zkeys/NftMint__prod.0.zkey ../contracts/contracts/verifier.sol
```

Note that no phase 2 trusted setup is performed, so do not use this in
production unless you perform one.

Next, compile the contracts:

```
cd ../contracts
npm run compileSol
```

Deploy the contracts to a testnet:

```bash
npx hardhat run build/deploy.js --network goerli
```

Verify the contracts on Etherscan:

1. Update `contracts/hardhat.config.js` with your Etherscan API key.
2. Run:

```bash
npx hardhat verify --network goerli <NftMint address> "<verifier address>"
```
