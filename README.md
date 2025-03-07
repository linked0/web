# web3 project for Smart contracts and other language
General information is located in [dev.md](./dev.md).
There is also the polocy for the project in [here](./doc/ProjectStyle.md).

## Setup
### Hardhat console
```
yarn
yarn hardhat console --network localnet
```

## Folders
### exref
- 참고 스마트 컨트랙트 프로젝트
- ex5 여기 있음.
### exlang
- 다양한 언어에 대한 예제

## 😈 Projects Folders
This is basically using ethers v6, hardhat-ignition-ethers.

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
- `exp`: Python project folder
  - Refer to the `README.md` in the folder
- `exg`: Go project folder
  - Refer to the `README.md` in the folder
- `exj`: Javascript project folder
  - Refer to the `README.md` in the folder
- `ext`: Typescript project folder
  - Refer to the `README.md` in the folder
- `exr`: Rust project folder
  - Refer to the `README.md` in the folder
