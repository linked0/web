# Sample Hardhat Project
이 프로젝트는 hardhat-deploy를 테스트하기 위해서 생성된 프로젝트.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

## Source Summary
- `efoundry-course`: foundry 강의 by Patrick Collins
  - cd ~/work/web/ecourse-foundry/L7-foundry-fund-me
  - make install
  - forge test
- `eondo-v1`: ondo 프로젝트
  - yarn test
- `erc4337-aa`: 4337 구현 hardhat 프로젝트
  - yarn simple
- `erc6900-reference`: erc-6900 foundry 프로젝트
  - forge test --match-path test/account/UpgradeableModularAccount.t.sol
- `euniswap-v2-hardhat`: uniswap 컨트랙트에 hardhat 프레임워크 적용
  - cp .env.sample .env
  - yarn test
- `ex`: 중요 기본 컨트랙트 프로젝트
- `ex5`: The very important project `seaport`
  - package.json 파일 참고
- `exdot`: TypeScript 코딩 테스트
  - node ex.js
- `exf`: foundry 테스트
  - forge test Counter
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
- `web_cairo`: Cairo 테스트 프로젝트
  - README 참고
- `smart-contract-hacking`: Solidity smart contract security
  - README 참고
- `eopenzeppelin-contracts`: openzeppelin contracts
  - [openzeppelin github](https://github.com/OpenZeppelin/openzeppelin-contracts)

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

## Chainlink project
