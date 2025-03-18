# Web3 Project for Smart Contracts
See [dev.md](./dev.md) for general info.  
Project policies, including coding style, are [here](./doc/ProjectStyle.md).

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

# PooNet Ecosystem
##  pooh-geth
## Betelgeuse
### Deploying WETH, Multicall based on localnet
Deploy contracts
```
cp .env.sample .env
cd ~/work/smart-contracts/betelgeuse
yarn deploy:localnet
```

The results are as follows. Copy them to `.env`.
```
CONDUIT_CONTROLLER_ADDRESS=0x38e0e626aE48A19beA89880E3EAc65Bdd620EAa3
CONDUIT_ADDRESS=0x1Fc4FE9233F8Cd9E0cf29f37C99B5D7B3b0faeE4
CONDUIT_KEY=0x1811DfdE14b2e9aBAF948079E8962d200E71aCFD000000000000000000000000
SEAPORT_ADDRESS=0x39E1F7e473DEF5911a81133d8Ef5c5bfBdFC2CA6
ASSET_CONTRACT_SHARED_ADDRESS=0xaFEBcc4491055DAF6f3211d917f80212931819d2
LAZY_MINT_ADAPTER_ADDRESS=0x171318B8700CD5A8160fc282F975b89346D91C16
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=0xc559c7d0c3851140185900d223b7fe531e8823a80000000000000100000f4240
WETH_ADDRESS=0x22B00b28fd16097533a83E37BCaD337D63aE6ef3
MULTICALL_ADDRESS=0x5a6B4111218761e19B5EdA036147eF746Da734E1
```

Run test trades and review
```
yarn trade:localnet
yarn check:trade:localnet
```

### Running backend
```
mkdir temp_image
cp .env.example .env
```

Copy the next to `.env`
```
RPC_URL=http://localhost:8585
ASSET_CONTRACT_SHARED_ADDRESS=0xaFEBcc4491055DAF6f3211d917f80212931819d2
LAZY_MINT_ADAPTER_ADDRESS=0x171318B8700CD5A8160fc282F975b89346D91C16
```

Migration
If the information about contract is changed, you should follow all the following commands.
```
yarn drop-schema
rm -rf src/migrations/*
yarn migration-create
yarn migration-up
```

Run the server without using a Dockerized PostgreSQL database if you want it.
```
yarn start-no-db
```

### Running frontend
```
cp .env.sample .env.dev
```

Copy these values from Betelgeuse project repository which can be retrieved from the following log generated whey deploying contracts or `.env` file of Betelgeuse.
```
# These constants are for .env of frontend
REACT_APP_SEAPORT_ADDRESS=0xF8E887c668F10D83c9aC391F22a5e2e1AfbCE18b
REACT_APP_ASSET_CONTRACT_SHARED_ADDRESS=0x19F8B9143588438e415223C6eD1E369e935130FC
REACT_APP_LAZY_MINT_ADAPTER_ADDRESS=0xc8587bde55D4186824BAC928A0d9f00b478c7103
REACT_APP_WETH_ADDRESS=0x6883994Ff042a26AE1f710e180B0d2A8225Fe348
REACT_APP_PAYABLE_PROXY_ADDRESS=0xa231949eFD93b3c156aAC734fB18Df1525b2B7d3
REACT_APP_MULTICALL_ADDRESS=0x33fcE949CAa1C9fCEBF486f6a7259c54B2f3EDE2
```
And set the value of `REACT_APP_MULTICALL_ADDRESS` to `REACT_APP_MULTICALL_ADDRESS_TESTNET`

Run the web server
```
yarn start:dev
```
or 
```
yarn start
```

## Tigger Swap

### tigger-swap-contracts
The pooh-erc20 is not used because Token.sol in tigger-swap-contracts is used for BOA.

Uniswap and Token contracts on tigger-swap-contracts Localnet
WETH_ADDRESS=0x1e80e9b38F5727Ad2c56a2e90bfF21642434Ff82 MULTICALL_ADDRESS=0x24eC01416dCfA432b4b877F0fc230955b3855C92 FACTORY_ADDRESS=0x73b82e23400525176f1f8B2c7ac6013F68A6dDf20xC2c83516c002046a9b4Afc1a830cA9B70dbCd945 ROUTER_ADDRESS=0x7d72459bD06C487Ea572bF7FDF3Bc4e1a23C80490x9C03F940a7A5A6c691aBDC07a16deC19b39980e2 CALLHASH_ADDRESS=0xcdb5c7a94a3b876fbeb290dd258ac954a243df6f3dc0a6ab2568dc6e8e732ad3 FEE_TO=0x0000000000000000000000000000000000000000 BOA_ADDRESS=0x24f16Afd05C011169E4a4E426DA8C609834bf1e50x18BE667f6a6261CAF97Ea4d30a0915f981424150 GTOKEN_ADDRESS=0xf43c2D2B537a84707C94E39682207b3aA1AfdB830xcAffF4489551d9962DC97e1DB1bB26B50A4971D4 ETOKEN_ADDRESS=0x7469843a2b39e0De83B7e6b78134D6725AB2E49B0x345264D8A41a55dF8FCa443b5D7c80332b94b6d4

Uniswap and Token contracts on tigger-swap-contracts on Marigold
WETH_ADDRESS=0xF6f4B08B97F7374Db656c05F6e27be873eC0E5Cf MULTICALL_ADDRESS=0xEa832C035E79B0e40d866BFcAfb6568E4D71D0E8 FACTORY_ADDRESS=0x0BA5B25444f96929342a7356b4B1026BDa304cF2 ROUTER_ADDRESS=0x9c86249E3A0473Dc6944b4F46f83E20D7f1c1a61 CALLHASH_ADDRESS=0xcdb5c7a94a3b876fbeb290dd258ac954a243df6f3dc0a6ab2568dc6e8e732ad3 FEE_TO=0x0000000000000000000000000000000000000000 BOA_ADDRESS=0x9B4ea652EC002AFb0e81Ca508F10fb68e0A16a24 GTOKEN_ADDRESS=0x4ad5BDa9e450340F384FE4aDB4DC3d3ed76a25a1 ETOKEN_ADDRESS=0x872e26D4940eD7342C72B462ab3f8C4d8034fd66

Uniswap and Token contracts on tigger-swap-contracts on PoohNet Devnet
WETH_ADDRESS=0x7d72459bD06C487Ea572bF7FDF3Bc4e1a23C8049 MULTICALL_ADDRESS=0xf9cC1E443c237a5A5B16a00ddC43566830BbA768 FACTORY_ADDRESS=0x7469843a2b39e0De83B7e6b78134D6725AB2E49B0x0e877509F73E3f06c86F1403bf4599329e4f7063 ROUTER_ADDRESS=0x56Bd9d617dCE5dCEcd792BB6e4cC22890D6B609d0xd1b04bb65b4Ba8D59c35A43E07A45cc694dC2C01 CALLHASH_ADDRESS=0xcdb5c7a94a3b876fbeb290dd258ac954a243df6f3dc0a6ab2568dc6e8e732ad3 FEE_TO=0x0000000000000000000000000000000000000000 BOA_ADDRESS=0x849b56b8C3aF8f8659453Ec19742751E0b6021580x9C03F940a7A5A6c691aBDC07a16deC19b39980e2 GTOKEN_ADDRESS=0xBB8FF6f7B48A142290721f94e2890a66E06881CC0xaA841D992A909aFbaE5dB2a6b424dADdcaa4Ad64 ETOKEN_ADDRESS=0xbcB08b651fB6319727c44eE093162764F9A4340A0x1f3D4ABCD77A130e417af38B6c71F06B944E4fe6

### tigger-bridge-contracts
Bridge contracts on tigger-bridge-contracts on Localnet
BOA_TOKEN_BRIDGE=0x87388bD5AdcD9A752B20c37dE2cDD8978d4c75Ff BOA_COIN_BRIDGE=0x3f7ADA8e897d72dE90097E1E1221bf8C988406Ea TOKEN_BRIDGE=0x39757B13270d50f2087D5fd15f83A6D6C31c7Fd2

BOA_TOKEN_BRIDGE=0x76386a0523fFd0261cBe70ACA8E61213e00bA4C5 BOA_COIN_BRIDGE=0x4557fF51D49ec670B59a5C883DC082b99eC485f8 TOKEN_BRIDGE=0x224d9B009450a3917287512Be181d2B3dCEc937A

Bridge contracts on tigger-bridge-contracts on PoohNet Devnet
BOA_TOKEN_BRIDGE=0x8f2961B7237cc28A1cA6f95371BE4Cd2c99f5Be5 BOA_COIN_BRIDGE=0x8C883156799698dF874Cc8Da00DdF971B744D801 TOKEN_BRIDGE=0x309E958ECb54C09094A0Fcd5F3478dB4bC33Babc

Approve User1's BOA to BOA_TOKEN_BRIDGE on on tigger-bridge-contracts Localnet
User1: 0xE024589D0BCd59267E430fB792B29Ce7716566dF(ae3b35fcbe8d65fa1e24802f95241ed22c6a68ea3958df0a40607a80bb292f97) yarn approve:localnet

Bridge contracts on tigger-bridge-contracts on PoohNet Devnet
BOA_TOKEN_BRIDGE=0x56A2438D895D7d8EDb3E22F41d11f1BFEbd11f26 BOA_COIN_BRIDGE=0x364D7a5D875C5ef272E9F3A73B94Db6f4f4bf7f6 TOKEN_BRIDGE=0xf1675e81da4Ccb7153EdF63955C19fcf0179ED87

Set the Admin to Manager role to BOA_COIN_BRIDGE on tigger-bridge-contracts Devnet
yarn setManager:devnet

Add liquidity to BOA_COIN_BRIDGE on tigger-bridge-contracts Devnet
yarn addLiquid:devnet

## Optimism

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
