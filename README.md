# Sample Hardhat Project
이 프로젝트는 hardhat-deploy를 테스트하기 위해서 생성된 프로젝트.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

## Source Summary
- `eondo-v1`: ondo 프로젝트
  - yarn test
- `erc4337-aa`: 4337 구현 hardhat 프로젝트
  - yarn simple
- `euniswap-v2-hardhat`: uniswap 컨트랙트에 hardhat 프레임워크 적용
  - cp .env.sample .env
  - yarn test
- `ex`: 중요 기본 컨트랙트 프로젝트
- `ex5`: The very important project `seaport`
  - package.json 파일 참고
- `exdot`: TypeScript 코딩 테스트
  - node ex.js
- `exzksync`: zksync 테스트
  - 이거 pooh-geth와 연동하려다가 실패함.
- `exzzbak`: 많이 안 쓰이는 프로젝트
  - commons-budget-contract
  - ehacking: Smart Contract Hacking 코스 Solution
  - eplanet
  - evalidators
  - exz-ex6
  - exz-original
- `tload` and `tstore` example
  - test/StorageSlot.local.test.js, StorageSlot.sol, StorageSlotMock.sol
    - localnet에서는 아직 `getXXX` 함수가 정상 동작하지는 않음. 
    - StorageSlot.local.test.js의 `TODO` 참고
  - DoubleBufferContract.sol

#### External Repositiries
- `webf`
  - `erc6900-reference`: erc-6900 foundry 프로젝트
    - forge test --match-path test/account/UpgradeableModularAccount.t.sol
  - `efoundry-course`: foundry 강의 by Patrick Collins
    - cd ~/work/web/ecourse-foundry/L7-foundry-fund-me
    - make install
    - forge test
  - `exf`: foundry 테스트
    - forge test Counter
- `web_cairo`: Cairo 테스트 프로젝트
  - README 참고
- `smart-contract-hacking`: Solidity smart contract security
  - README 참고
- `eopenzeppelin-contracts`: openzeppelin contracts
  - [openzeppelin github](https://github.com/OpenZeppelin/openzeppelin-contracts)

## Good Practices
- `flux-finance` 프로젝트 처럼 `openzeppelin` 같은 외부 프로젝트를 코드에 직접 포함시키는 것도 방법
  - `contracts/external/openzeppelin`, 여기는 `src` 대신 `contracts` 폴더를 사용.
- Random Key 생성
	```
	yarn keys
	```

## .env 정리
- Marigold에 대해서는 .env.sample에 정리
- DevNet에 대해서는 .env.devent에 정리

## Run Devnet/Marigold
### Marigold
```
./init marigold 1
./enode-cmd
```
### Devnet
The chain id is 7212302. So it uses enode-cmd-devnet.
```
./init devnet 1
./enode-cmd-devnet
```
As of 19th Nov. 2024, we use `http://3.37.37.195:8545` for the RPC URL.

## ethers v5 vs ethers v6 issue 
- all-basic.ts를 두개로 분리함

#### all-basic.ts
- `yarn test:basic` 로 테스트
- 특이하게, `ethers.provider.send('eth_sendRawTransaction', ...)` 함수를 ethers v6 환경에서 사용하려고 하면 아래의 에러가 뜸
  ```
  InvalidArgumentsError: Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337
    at EdrProviderWrapper.request (/Users/jay/work/web/ex/node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:453:19)
    at async Context.<anonymous> (/Users/jay/work/web/ex/test/all-basic-sign.ts:171:19)
  ```

#### all-balic-ethers5.ts
- `yarn test:basic5` 로 테스트
- `ethers.provider.send('eth_sendRawTransaction', ...)`
- `ethers.provider.send('eth_call', ...)`
- 이런 복잡한 처리를 할 때는 어쩔수 없이 ethers v5를 이용한 소스를 써야 할 듯함.
  - 이미 참고 소스가 존재하고, 테스트 코드에 복잡성을 따로 파일로 분리시킨다면 문제 없을 것으로 보임.


## Issues
#### pooh-geth `cancun` 미적용 문제
- contract-dencun과 contract-seaport 컨트랙트를 사용할 때, localnet에서는 테스트가 안됨.
- 원래는 contracts 폴더 안에 있으나, localnet과 연동시에는 바깥으로 옮겨야하는 불편함이 있음.
- localnet으로 쓰는 pooh-geth가 Cancun evm으로 빌드되어 있지 않기 때문임.
- 다음의 코드 참고 (hardhat.config.ts)
  ```typescript
  {
    version: "0.8.24",
    settings: {
      evmVersion: process.env.EVM_VERSION || "cancun",
      ...
    }
    ...
  }
  ```
- 환경변수 값에 따라서 컴파일 대상을 변경할 수는 없는 것으로 보임.
  - 참고로, 테스트되는 파일의 위치나 이름으로 환경변수 값을 바꿀 수는 있음.
- 24.11.01 solved
  - Added the following configurations into `genesis_testnet.json`
    ```
    "shanghaiTime": 0,
    "cancunTime": 0,
    ```

## Hardhat
```
yarn
yarn test
```

### oz contract test
- ex 폴더로 이동
- 원하는 테스트 파일 골라서 다음과 같이 실행
```
yarn hardhat test /Users/jay/work/web/ex/test/oz/access/Ownable.test.js
```

### seaport contract test
- ex5 폴더로 이동
- 원하는 테스트 파일 골라서 다음과 같이 실행
```
yarn hardhat test /Users/jay/work/web/ex/test/seaport/basic.spec.ts
```

### test를 pooh-geth로 localnet에서 테스트할 때 주의점
- `pooh-geth`는 cancun 빌드가 아니기 때문에, `.env` 파일에서 다음과 같이 설정하고 해야함.
```
EVM_VERSION=london
```

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

## .gitmodules
```
[submodule "poohcode"]
	path = poohcode
	url = https://github.com/poohgithub/poohcode
[submodule "dao-budget-contracts"]
	path = dao-budget-contracts
	url = https://github.com/poohgithub/dao-budget-contracts
[submodule "web2"]
	path = web2
	url = https://github.com/linked0/web2
[submodule "zksync-era"]
	path = zksync-era
	url = https://github.com/poohgithub/zksync-era
[submodule "ondo-v1"]
	path = ondo-v1
	url = https://github.com/poohgithub/ondo-v1.git
[submodule "keyless2/pooh-swap-lib"]
	path = ex/pooh-swap-lib
	url = https://github.com/poohgithub/pooh-swap-lib
[submodule "ondo-v1-linked0"]
	path = ondo-v1-linked0
	url = https://github.com/linked0/ondo-v1.git
[submodule "pooh-swap-v2-periphery"]
	path = pooh-swap-v2-periphery
	url = https://github.com/poohgithub/pooh-swap-v2-periphery
[submodule "argent-contracts"]
	path = argent-contracts
	url = https://github.com/linked0/argent-contracts.git
[submodule "solidstate-solidity"]
	path = solidstate-solidity
	url = https://github.com/linked0/solidstate-solidity.git
[submodule "account-abstraction"]
	path = account-abstraction
	url = https://github.com/linked0/account-abstraction.git
[submodule "pooh-erc20"]
	path = pooh-erc20
	url = https://github.com/linked0/pooh-erc20
[submodule "openzeppelin-contracts"]
	path = openzeppelin-contracts
	url = https://github.com/linked0/openzeppelin-contracts.git
[submodule "poohnet/poohgeth"]
	path = poohnet/poohgeth
	url = https://github.com/poohgithub/poohgeth
[submodule "poohnet/poohprysm"]
	path = poohnet/poohprysm
	url = https://github.com/poohgithub/poohprysm
[submodule "poohnet/pooh-land"]
	path = poohnet/pooh-land
	url = https://github.com/poohgithub/pooh-land
[submodule "poohnet/pooh-land-js"]
	path = poohnet/pooh-land-js
	url = https://github.com/poohgithub/pooh-land-js
[submodule "poohnet/pooh-swap-v2-core"]
	path = poohnet/pooh-swap-v2-core
	url = https://github.com/poohgithub/pooh-swap-v2-core
[submodule "poohnet/pooh-swap-v2-periphery"]
	path = poohnet/pooh-swap-v2-periphery
	url = https://github.com/poohgithub/pooh-swap-v2-periphery
[submodule "poohnet/pooh-swap-v2-hardhat"]
	path = poohnet/pooh-swap-v2-hardhat
	url = https://github.com/linked0/pooh-swap-v2-hardhat.git
[submodule "ex2/lib/forge-std"]
	path = exhf/lib/forge-std
	url = https://github.com/foundry-rs/forge-std
[submodule "exf/lib/forge-std"]
	path = exf/lib/forge-std
	url = https://github.com/foundry-rs/forge-std
[submodule "exf/lib/openzeppelin-contracts"]
	path = exf/lib/openzeppelin-contracts
	url = https://github.com/OpenZeppelin/openzeppelin-contracts
[submodule "erc/erc4636-T-REX"]
	path = erc/erc4636-T-REX
	url = https://github.com/linked0/erc4636-T-REX.git
[submodule "erc/erc6900-impl"]
	path = erc/erc6900-impl
	url = https://github.com/linked0/reference-implementation.git
[submodule "erc/erc6551-reference"]
	path = erc/erc6551-reference
	url = https://github.com/linked0/erc6551-reference.git
[submodule "exf/lib/account-abstraction"]
	path = exf/lib/account-abstraction
	url = https://github.com/eth-infinitism/account-abstraction
[submodule "poohnet/deterministic-deployment-proxy"]
	path = poohnet/deterministic-deployment-proxy
	url = https://github.com/linked0/deterministic-deployment-proxy.git
[submodule "ex/lib/forge-std"]
	path = ex/lib/forge-std
	url = https://github.com/foundry-rs/forge-std
[submodule "ecourse-foundry/L7-foundry-fund-me/lib/chainlink-brownie-contracts"]
	path = ecourse-foundry/L7-foundry-fund-me/lib/chainlink-brownie-contracts
	url = https://github.com/smartcontractkit/chainlink-brownie-contracts
[submodule "ecourse-foundry/L7-foundry-fund-me/lib/foundry-devops"]
	path = ecourse-foundry/L7-foundry-fund-me/lib/foundry-devops
	url = https://github.com/cyfrin/foundry-devops
[submodule "ecourse-foundry/L7-foundry-fund-me/lib/forge-std"]
	path = ecourse-foundry/L7-foundry-fund-me/lib/forge-std
	url = https://github.com/foundry-rs/forge-std
[submodule "erc6900-reference/lib/forge-std"]
	path = erc6900-reference/lib/forge-std
	url = https://github.com/foundry-rs/forge-std
[submodule "erc6900-reference/lib/account-abstraction"]
	path = erc6900-reference/lib/account-abstraction
	url = https://github.com/eth-infinitism/account-abstraction
[submodule "erc6900-reference/lib/openzeppelin-contracts-upgradeable"]
	path = erc6900-reference/lib/openzeppelin-contracts-upgradeable
	url = https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable
[submodule "erc6900-reference/lib/openzeppelin-foundry-upgrades"]
	path = erc6900-reference/lib/openzeppelin-foundry-upgrades
	url = https://github.com/OpenZeppelin/openzeppelin-foundry-upgrades
[submodule "erc6900-reference/lib/solady"]
	path = erc6900-reference/lib/solady
	url = https://github.com/vectorized/solady
[submodule "erc6900-reference/lib/openzeppelin-contracts"]
	path = erc6900-reference/lib/openzeppelin-contracts
	url = https://github.com/OpenZeppelin/openzeppelin-contracts
```
