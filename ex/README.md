# Sample Hardhat Project
이 프로젝트는 hardhat-deploy를 테스트하기 위해서 생성된 프로젝트.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

## Source Summary
- efoundry-course-src: foundry 강의 by Patrick Collins
- erc4337-aa: 4337 구현 hardhat 프로젝트
- erc6900-reference: erc-6900 foundry 프로젝트
- ex: 중요 기본 컨트랙트 프로젝트
- ex5: seaport등 
- exdot: TypeScript 코딩 테스트
- exf: foundry 테스트
- exzksync: zksync 테스트
- exzzbak: 많이 안 쓰이는 프로젝트
  - commons-budget-contract
  - ehacking: Smart Contract Hacking 코스 Solution
  - eplanet
  - evalidators
  - exz-ex6
  - exz-original

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
