# Knowledge Base & Projects
🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴
- [README](./README.md)
- [Coding Style](./doc/ProjectStyle.md)
- [dev.md]([bit.ly/3MVG5AN), [dev.md text](bit.ly/3MT0VRb)
- [Miki](https://bit.ly/421Gf1x), [Miki-Sum](https://bit.ly/4iWn0fY)
- [작업 환경 세팅](./zsub/work-env.md)
- [Poohnet & Betelgeuse](#poohnet)
- [Code](#-code) - [Projects](#-projects)
- [Error](./zsub/error.md) - [Trend](#-trend)

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
```
cp .env.sample .env
code ~/work/betelgeuse/contracts/.env
```
copy following env variables to current .env
```
WETH_ADDRESS=0x6883994Ff042a26AE1f710e180B0d2A8225Fe348
MULTICALL_ADDRESS=0x33fcE949CAa1C9fCEBF486f6a7259c54B2f3EDE2
```
Deploy
```angular2html
yarn deploy:localnet
```
Copy the results to the .env
```angular2html
WETH_ADDRESS=0x6883994Ff042a26AE1f710e180B0d2A8225Fe348
MULTICALL_ADDRESS=0x33fcE949CAa1C9fCEBF486f6a7259c54B2f3EDE2
FACTORY_ADDRESS=0xA6FBF5880FaAa1AbC7FD01d6915A3c1AaAB3Eb4A
ROUTER_ADDRESS=0x0fC9a2Ca2971feCd90daCF2aB6297492b0A20942
CALLHASH_ADDRESS=0xcdb5c7a94a3b876fbeb290dd258ac954a243df6f3dc0a6ab2568dc6e8e732ad3
FEE_TO=0x0000000000000000000000000000000000000000
BOA_ADDRESS=0x1A59e73559184658caD8cD0d888989F107c01AeC
GTOKEN_ADDRESS=0x479D03509d8d620EcFdf8db00B983d50eaf16884
ETOKEN_ADDRESS=0x3213AF3bDba7522d3a263072C9e1Fca8440C0f3B
```
Check the Pair
```angular2html
yarn get-pair:localnet
```

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




## 😈 code

### ignition
- [Hardhat Ignition](https://hardhat.org/ignition/docs/getting-started#quick-start)
- [Medium Article](https://medium.com/nomic-foundation-blog/introducing-hardhat-ignition-a-refreshed-deployments-experience-9580d2946e10)
1. Refer to `contracts/ignition` folder
2. Refer to `ignition/modules` folder
3. Run deploy script
```
hardhat ignition deploy ignition/modules/apollo.ts --network localnet
```
4. Check `ignition/deployments` folder
5. Remove `ignition/deployments` folder if you want to deploy contract from start.

### OpenSea fulfillOrder parameter ABI encode
```
function fulfillOrder(
  /**
    * @custom:name order
    */
  Order calldata,
  bytes32 fulfillerConduitKey
) external payable override returns (bool fulfilled)
```

```
+------------------------------------------+
| 0x00..0x03 : Function Selector           |
+------------------------------------------+
| 0x04..0x23 : offset To Order = 0x80      | (for param1: Order)
+------------------------------------------+
| 0x24..0x43 : fulfillerConduitKey         | (for param2: conduitKey)
+------------------------------------------+
| 0x44(68)..0x63 : offset to acutal data = 0x40| (start of `parameters` of `AdvancedOrder`)
+------------------------------------------+
| 0x64..0x83 : (unused or ...)             |
+------------------------------------------+
| 0x84(132)..0xA3 : offerer                | (start of `offer`)
| 0xA4..0xC3 : zone                        |
+------------------------------------------+
| 0xC4..0xE3 : offset to  parameters = 0x40|
| 0xE4..0x103 : (unused or ...)            |
+------------------------------------------+
[ array length of offer ]      // 32 bytes
[ pointerToElem0StructData ]   // 32 bytes
[ pointerToElem1StructData ]   // 32 bytes
...
(Then in the tail region)
Elem0 struct data
Elem1 struct data
...
+------------------------------------------+
| `consideration` part
+------------------------------------------+
```

```
struct AdvancedOrder {
  OrderParameters parameters;
  uint120 numerator;
  uint120 denominator;
  bytes signature;
  bytes extraData;
}

struct OrderParameters {
  address offerer; // 0x00
  address zone; // 0x20
  OfferItem[] offer; // 0x40
  ConsiderationItem[] consideration; // 0x60
  OrderType orderType; // 0x80
  uint256 startTime; // 0xa0
  uint256 endTime; // 0xc0
  bytes32 zoneHash; // 0xe0
  uint256 salt; // 0x100
  bytes32 conduitKey; // 0x120
  uint256 totalOriginalConsiderationItems; // 0x140
  // offer.length                          // 0x160
}
```

### `openzeppelin` 같은 외부 프로젝트 적용
- `flux-finance` 프로젝트 처럼 `openzeppelin` 같은 외부 프로젝트를 코드에 직접 포함시키는 것도 방법
  - `contracts/external/openzeppelin`, 여기는 `src` 대신 `contracts` 폴더를 사용.

### Random Key 생성 (#키생성 #키 생성 #Key Generation)
```
yarn keys
```

### Python 참고 코드   
여기서 0x를 쓰면 안됨.
> hex_string = "48656c6c6f20576f726c64"  # Hex encoded string for "Hello World"
> byte_string = bytes.fromhex(hex_string)
> regular_string = byte_string.decode("utf-8")

from datetime import datetime
datetime.fromtimestamp(7214123987)

> print(f"{a:08x}{b:016x}{c:08x}")
0000006400000000000227b200000005

### Python에서 Ethereum 호출
w3 = Web3(Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/73I-qvN9yqtRcajnfvEarwA2FNHM4Nph')


### ethers v5
(ethersv5)
"ethers-v5": "npm:ethers@5",

### Private key로 keystore 파일 만들기 
(keystore, decrypt, encrypt)

**account import**
- Create `mykeyfile` and set private key in the file (`0x`는 붙이면 안됨)
- `geth --datadir ./mykeystore account import mykeyfile`
- `mykeystore` 폴더에 파일 생성됨

**decrypt**
```
const data = JSON.parse(
  fs.readFileSync(path.resolve(Utils.getInitCWD(), this.key), "utf-8")
);
const account = hre.web3.eth.accounts.decrypt(data, "pooh2024");
this.key = account.privateKey;
```

### Deploy factory contract (Deterministic deployment proxy)
#### Reference
- `pooh-geth/poohnet/deploy-deployer.sh` on `pooh-geth`
- `npx hardhat test test/all-basic.ts --grep CREATE2` on `web`
- `npx hardhat run scripts/deploy-with-create2.ts --network localnet` on `web`

#### Check if the factory exists
The Create2 factory contract will be deployed at the address **`0x4e59b44847b379578588920cA78FbF26c0B4956C`**. You can check if this contract has already been deployed to your L1 network with a block explorer or by running the following command:
```
cast codesize 0x4e59b44847b379578588920cA78FbF26c0B4956C --rpc-url $L1_RPC_URL
```
If the command returns 0 then the contract has not been deployed yet. If the command returns 69 then the contract has been deployed and you can safely skip this section.

#### Fund the factory deployer
You will need to send some ETH to the address that will be used to deploy the factory contract, `0x3fAB184622Dc19b6109349B94811493BF2a45362`. This address can only be used to deploy the factory contract and will not be used for anything else. Send at least 1 ETH to this address on your L1 chain.

#### Deploy the factory
Using cast, deploy the factory contract to your L1 chain:
```
cast publish --rpc-url $L1_RPC_URL 0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222 
```
#### Wait for the transaction to be mined
Make sure that the transaction is included in a block on your L1 chain before continuing.

#### Verify that the factory was deployed
Run the code size check again to make sure that the factory was properly deployed:
```
cast codesize 0x4e59b44847b379578588920cA78FbF26c0B4956C --rpc-url $L1_RPC_URL
```

### oz contract test
- web 디렉토리에서 실행
- 원하는 테스트 파일 골라서 다음과 같이 실행
```
yarn hardhat test test/oz/access/Ownable.test.js
```

### seaport contract test
- ex5 디렉토리로 이동
- 원하는 테스트 파일 골라서 다음과 같이 실행
```
yarn hardhat test /Users/jay/work/web/ex/test/seaport/basic.spec.ts
```
```
yarn sea
```

### test를 pooh-geth로 localnet에서 테스트할 때 주의점
- `pooh-geth`는 cancun 빌드가 아니기 때문에, `.env` 파일에서 다음과 같이 설정하고 해야함.
```
EVM_VERSION=london
```

## 😈 Projects

### External repositiries
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

## 😈 Trend
### 25.02.20
@ 전체
- 소니는 자동차를 통해서 경험을 팔겠다.
- 더이상 운전하면서 시간을 낭비할 일은 없을 것임. 
- OnDevice AI (인터넷이 안되도 됨)
- Land-Air-Craft 

@ 칼리버스
  - 공간음향을 만드는 것도 GenAI를 사용함.
  - 스마트 폰으로 사진을 찍으면 Unreal 엔진으로 생성된 오브젝트가 생성되는 제품. 쇼핑에서 활용 가능
  - 사람을 스캐닝해서 가상공간에서 사용됨.

@ TCL
  - 10년전에 CES에서 종이 상자로 안경을 만드는 걸 3D 안경을 보여줌. 
  - 스마트글래스를 통해서 다른 성능의 화면을 볼 수 있음. 
  - 실시간 번역기능이 있는데, 얼마나 쓰기 편할지... 의문.

### 막오른 '세상 만물 투자' 토큰증권…내년 본격 궤도 오르나
* 입력 2024.12.25.
* 토큰증권은 종전에 돈을 넣기 어려웠던 자산을 잘게 쪼개 금투상품으로 전환하는데 요긴하다.
* 이 때문에 이번 22대 국회에 발의된 법안(자본시장법·전자증권법 개정안)은 비정형 증권의 발행 및 유통을 법제화해 불확실성의 족쇄를 없애는 데 초점을 맞췄다.
* 업계에서는 맨 먼저 보편화할 토큰증권으로 부동산 조각투자 상품을 꼽는 이들이 많다.
* 미술품과 저작권 등 자산은 가치 평가가 까다롭지만 부동산은 가치 산정과 거래 시기 예측이 비교적 쉽고, 실제 건물·토지를 토대로 하는 만큼 배당 안정성과 환금성 면에서 더 유리하기 때문이다.

### ChatGPT o1, o3
- o3: private chain of thought
- o1:  논리적 오류 결합을 지켜줌. 추론을 잘함.
  - 변화를 유추하도록 함. 추론 성능
- xml 태그를 쓰면 좋다.

### CES & TTimes
- Grader를 통한 나만의 FineTuning
- 카메라로 상황을 보고 가이드해주는 것(예를들어 기계 고치는법)
---
- NVidia는 하드웨어/소프트웨어 키트. 하드웨어 회사가 지향점은 아님.
- 중국 로봇의 가격경쟁력.
- NVidia Cosmos. 가상현실에서 학습하기 위한 것. 프롬프트로 가상현실 만듬. (디지털 트윈) ==> 메타버스
---
- 2년전에 채비서는 계산을 못했고 이제 계산을 함. 다음 2년은 어떻게 봐뀔지.
---
- 양자 컴퓨터칩. 윌로우
- 강의를 경청한후에 노팅을 하라.
- P2P 개념, 운전면허가 필요없게 됨.
- 택시 기사, 우버 기사 고용률 떨어질 것임. 정치랑 경제는 뗄수 없는 우리나라 우버 사태
- AI Agent
---
- 로봇개가 쓰레기 처리 및 로봇 군사가 확대될 것임.
---
- 컨택스트 스위칭을 잘 해야함.
- 세부 스텝을 적어놓고 일을 시작하는 것. (복잡한 문제가 아니라, To do list 임)
- 중간에 다른 질문을 들어오면 내 현재 작업을 마치고 대답. 쪼개놓으면 돌아오기 쉽다. 체크포인트를 기록
- 초기 커밋을 다 날릴 수도 있음.
- 2000줄의 코드체인지가 일어나야한다면 스태킹을 잘 해야함. 
- 100줄 이하 체인지로 보내기. 유닛테스트, 리팩토링은 그것만.
---
- 자영업, 전세계와 경쟁중. (베트남 쌀국수)
- 적게 팔아도 생활비 보탬이 되면 무인가게가 늘어남.


### 🏆 생성형 AI에서 AGI까지ㅣ카이스트 김대식 교수
[Youtube](https://youtu.be/-i78SZAJG8E?si=Eb17Pn3fF1xmJTOK)
- 멀티모달, 휴대폰으로 인공지능을 쓰지는 않을 것
- 휴대폰의 시대가 끝난다.: 그렇게 한다고 하면 그렇게 된다. Self-fullfilling process
- New formfactor, 새로운 데이터를 찾아라.
- 2~3년후에 인공지능과 열라게 말하게 될 것.
- 모델이 커지면서 갑자기 새롭게 해결되는 현상이 발생함.
- 5년후 100조 모델은 AGI
- AI Pilot

### 🏆 CES 2025
  - Intent based의 동작을 하게 한다.
  - AI MPC in 게임.
  - 물리 인공지능
  - AGI - ASI (super intelligence)
  - Lipsync 제품
  - 이미지를 3D로 바꿈.
  - AI Agent: 복잡한 작업 실행. 구글이 가장 빠르게 적용(Universal Assistent, Javis)
  - Copilot Studio, AI Agent Studio
  - 업무 자동화
  - Fabrix: LLM을 보안과 함께 도임. 클라우드 형태.
  - MultiAgent: 리더에이전트가 하위 에이전트와 통신함.
  - Personal Agent: 나의 역할을 대신함.
  - Brity Automation


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

🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🔥⚾️🐶🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🔥⚾️🐶🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆🍜😈🐹⚽️🏀🏈🪀🎾🐳🍀🌼🌸🏆⚾️🐶🦄☕️🚘🎱🌟🔴🌼🏓🦋⚾️🥎🏐⚽️🏀🏈


-------
## Solidity

### function type 바꾸기
```
function _getManifest() internal view returns (PluginManifest memory) {
  PluginManifest memory m = abi.decode(_manifest, (PluginManifest));
  return m;
}

function _castToPure(
  function() internal view returns (PluginManifest memory) fnIn
)
  internal
  pure
  returns (function() internal pure returns (PluginManifest memory) fnOut)
{
  assembly ("memory-safe") {
    fnOut := fnIn
  }
}

function pluginManifest() external pure returns (PluginManifest memory) {
  return _castToPure(_getManifest)();
}
```

### getContractFactory & ContractFactory
```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Greeter {
    string internal _greeting;

    constructor(string memory newGreeting) {
        _greeting = newGreeting;
    }

    function setGreeting(string memory newGreeting) public {
        _greeting = newGreeting;
    }

    function greet() public view returns (string memory) {
        return _greeting;
    }
}
```

```
import { ethers } from "hardhat";
import { expect } from "chai";
import  Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";

describe("ContractFactory", function () {
  async function greeterFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    return { owner, otherAccount };
  }

  it("Should return the new contract instance", async function () {
    const Factory = await ethers.getContractFactory("Greeter");
    const greeter = await Factory.deploy("Hello, Hardhat!");

    console.log("Greeter deployed to:", greeter.target);

    expect(await greeter.greet()).to.equal("Hello, Hardhat!");
  });

  it("Should create a new contract instance with ethers.ContractFactory", async function () {
    const { owner } = await greeterFixture();
    const greeter = await new ethers.ContractFactory(
      Greeter.abi, Greeter.bytecode, owner).
      deploy("Hello, Hardhat!");

    const contract = await ethers.getContractAt('Greeter', greeter.target, owner);
    expect(await contract.greet()).to.equal("Hello, Hardhat!");
  });
});

```
-------
## Smart Contract/Hardhat
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### Hardhat config defaultNetwork
참고: https://github.com/poohgithub/zksync-era/blob/main/poohnet/paymaster-examples/contracts/hardhat.config.ts

---
### create2 함수
아래 함수는 UniswapV2Factory에서 사용되는 코드임

```solidity
bytes memory bytecode = type(UniswapV2Pair).creationCode;
bytes32 salt = keccak256(abi.encodePacked(token0, token1));
assembly {
    pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
}
```

Unlike create, which generates the contract address based on the address of the creator and how many contracts it has created (nonce), create2 generates the address using the creator's address, a provided salt, and the hash of the initialization code. This allows for predictable computation of the contract's address before the contract is actually deployed.

- Endowment (0): This is the amount of Ether, in wei, that is sent to the new contract upon creation. In this case, it's set to 0, meaning no Ether is sent.

- Memory Start (add(bytecode, 32)):
bytecode is the initialization code for the contract you want to create. In Solidity, contract bytecode is often stored in an array, and this array includes a 32-byte length prefix.
add(bytecode, 32) calculates the starting point of the actual bytecode, skipping the first 32 bytes which represent the length of the bytecode. This is necessary because create2 requires a pointer to the start of the actual code, not the length prefix.
Size of Code (mload(bytecode)):

- mload(bytecode) is used to load the first 32 bytes of bytecode, which, as mentioned, contain its size. This tells create2 how much of the memory starting from add(bytecode, 32) it should read and use as the initialization code.
Salt (salt):

- The salt is a 32-byte value that you provide. It's part of the formula used to calculate the address of the new contract.
In your code, salt is generated from the hash of two token addresses, which helps ensure that each pair of tokens gets a unique contract address.

---
### 트랜잭션 취소하는 방법
- https://support.metamask.io/hc/en-us/articles/360015489251-How-to-speed-up-or-cancel-a-pending-transaction
- MetaMask의 설정의 고급에 들어가서 "활동 및 논스 데이터 지우기"

---
### Nonce 얻어내기
- docker exec -it pow-node geth attach data/geth.ipc
- eth.getTransactionCount("0x8B595d325485a0Ca9d41908cAbF265E23C172847")
- 여기서 나타나는 Nonce를 트랙잭션에서 사용하는 것임.
- 다른 방법
    - const nonce = await provider.getTransactionCount(admin.address);

---
### Type error: Cannot find module '../typechain-types' or its corresponding type declarations.
그냥 typechain-types 폴더를 쓰지 않기로 함 

---
### Error HH412: Invalid import

```
Error HH412: Invalid import @poohnet/pooh-swap-v2-core/contracts/interfaces/IUniswapV2Factory.sol from contracts/periphery/UniswapV2Router01.sol. Trying to import file using the own package's name.
```

- import 대상인 @poohnet/pooh-swap-v2-core과 package.json의 name이 동일해서 생긴 문제
- chatGPT에게 물어서 해결됨. 

---
### Error: network does not support ENS
다음과 같이 VAULT_CONTRACT 주소 잘못됨, 즉, 0x가 두번 쓰이고 있었음.
VAULT_CONTRACT=0x0x7f28F281d57AC7d99A8C2FAd2d37271c2c9c67D6		

---
### L1-governance 배포 에러
```
L1-governance git:(main) ✗ yarn hardhat run --network localnet ./scripts/deploy.ts 
yarn run v1.22.19
warning package.json: No license field
$ /Users/hyunjaelee/work/tutorials/L1-governance/node_modules/.bin/hardhat run --network localnet ./scripts/deploy.ts
TypeError: (0 , ethers_1.getAddress) is not a function
```

🏆 다음의 세단계 필요
1. yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
2. const deployed = await contract.waitForDeployment();
3. console.log(`Governance contract was successfully deployed at ${await deployed.getAddress()}`);

🏆 원인
- ethers 버전이 6으로 업그레이드되면서 함수명이 바뀌었음
- 기타
  - 0xAe9Bc22B80D98aD3350a35118F723d36d8E4e141

### wait 함수의 인자
The wait() function of ContractTransaction takes a single optional argument, which is the timeout in blocks. The default timeout is 10 blocks. This means that the wait() function will block for up to 10 blocks before throwing an error if the transaction has not been confirmed.
You can increase the timeout period by passing a higher number to the wait() function. For example, the following code will block for up to 20 blocks before throwing an error:

### Contract Size
https://ethereum.stackexchange.com/questions/31515/how-to-check-the-size-of-a-contract-in-solidity

### Exceeds Gas Limit 에러
- Genesis.json에서 gasLimit를 에러 내용의 
- 에러내용 "gasLimit: BigNumber { _hex: '0x989680', _isBigNumber: true }" 만큼으로 늘려줌.
```
Error: Error: processing response error (body="{\"jsonrpc\":\"2.0\",\"id\":151,\"error\":{\"code\":-32000,\"message\":\"exceeds block gas limit\"}}\n", error={"code":-32000}, requestBody="{\"method\":\"eth_sendRawTransaction\",\"params\":[\"0x02f90fd382300d0284461bffd584461bffd58398968094572b9410d9a14fa729f3af92cb83a07aaa472de080b90f644af63f020000000000000000000000000000000000000000000000000000000000000040fe07c7c6f88cdf003f00c1e47076de3576e136c7114496823271143b3d46e97e0000000000000000000000000000000000000000000000000000000000000ef9608060405234801561001057600080fd5b50610ed9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e1461025a578063bce38bd714610275578063c3077fa914610288578063ee82ac5e1461029b57600080fd5b80634d2301cc146101ec57806372425d9d1461022157806382ad56cb1461023457806386d516e81461024757600080fd5b80633408e470116100c65780633408e47014610191578063399542e9146101a45780633e64a696146101c657806342cbb15c146101d957600080fd5b80630f28c97d146100f8578063174dea711461011a578063252dba421461013a57806327e86d6e1461015b575b600080fd5b34801561010457600080fd5b50425b6040519081526020015b60405180910390f35b61012d610128366004610a85565b6102ba565b6040516101119190610bb7565b61014d610148366004610a85565b6104ef565b604051610111929190610bd1565b34801561016757600080fd5b50437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0140610107565b34801561019d57600080fd5b5046610107565b6101b76101b2366004610c59565b610690565b60405161011193929190610cb3565b3480156101d257600080fd5b5048610107565b3480156101e557600080fd5b5043610107565b3480156101f857600080fd5b50610107610207366004610cdb565b73ffffffffffffffffffffffffffffffffffffffff163190565b34801561022d57600080fd5b5044610107565b61012d610242366004610a85565b6106ab565b34801561025357600080fd5b5045610107565b34801561026657600080fd5b50604051418152602001610111565b61012d610283366004610c59565b61085a565b6101b7610296366004610a85565b610a1a565b3480156102a757600080fd5b506101076102b6366004610d11565b4090565b60606000828067ffffffffffffffff8111156102d8576102d8610d2a565b60405190808252806020026020018201604052801561031e57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f65790505b5092503660005b8281101561047757600085828151811061034157610341610d59565b6020026020010151905087878381811061035d5761035d610d59565b905060200281019061036f9190610d88565b6040810135958601959093506103886020850185610cdb565b73ffffffffffffffffffffffffffffffffffffffff16816103ac6060870187610dc6565b6040516103ba929190610e2b565b60006040518083038185875af1925050503d80600081146103f7576040519150601f19603f3d011682016040523d82523d6000602084013e6103fc565b606091505b50602080850191909152901515808452908501351761046d577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b5050600101610325565b508234146104e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4d756c746963616c6c333a2076616c7565206d69736d6174636800000000000060448201526064015b60405180910390fd5b50505092915050565b436060828067ffffffffffffffff81111561050c5761050c610d2a565b60405190808252806020026020018201604052801561053f57816020015b606081526020019060019003908161052a5790505b5091503660005b8281101561068657600087878381811061056257610562610d59565b90506020028101906105749190610e3b565b92506105836020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166105a66020850185610dc6565b6040516105b4929190610e2b565b6000604051808303816000865af19150503d80600081146105f1576040519150601f19603f3d011682016040523d82523d6000602084013e6105f6565b606091505b5086848151811061060957610609610d59565b602090810291909101015290508061067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b50600101610546565b5050509250929050565b43804060606106a086868661085a565b905093509350939050565b6060818067ffffffffffffffff8111156106c7576106c7610d2a565b60405190808252806020026020018201604052801561070d57816020015b6040805180820190915260008152606060208201528152602001906001900390816106e55790505b5091503660005b828110156104e657600084828151811061073057610730610d59565b6020026020010151905086868381811061074c5761074c610d59565b905060200281019061075e9190610e6f565b925061076d6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166107906040850185610dc6565b60405161079e929190610e2b565b6000604051808303816000865af19150503d80600081146107db576040519150601f19603f3d011682016040523d82523d6000602084013e6107e0565b606091505b506020808401919091529015158083529084013517610851577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b50600101610714565b6060818067ffffffffffffffff81111561087657610876610d2a565b6040519080825280602002602001820160405280156108bc57816020015b6040805180820190915260008152606060208201528152602001906001900390816108945790505b5091503660005b82811015610a105760008482815181106108df576108df610d59565b602002602001015190508686838181106108fb576108fb610d59565b905060200281019061090d9190610e3b565b925061091c6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff1661093f6020850185610dc6565b60405161094d929190610e2b565b6000604051808303816000865af19150503d806000811461098a576040519150601f19603f3d011682016040523d82523d6000602084013e61098f565b606091505b506020830152151581528715610a07578051610a07576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b506001016108c3565b5050509392505050565b6000806060610a2b60018686610690565b919790965090945092505050565b60008083601f840112610a4b57600080fd5b50813567ffffffffffffffff811115610a6357600080fd5b6020830191508360208260051b8501011115610a7e57600080fd5b9250929050565b60008060208385031215610a9857600080fd5b823567ffffffffffffffff811115610aaf57600080fd5b610abb85828601610a39565b90969095509350505050565b6000815180845260005b81811015610aed57602081850181015186830182015201610ad1565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b600082825180855260208086019550808260051b84010181860160005b84811015610baa578583037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001895281518051151584528401516040858501819052610b9681860183610ac7565b9a86019a9450505090830190600101610b48565b5090979650505050505050565b602081526000610bca6020830184610b2b565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610c4b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0888703018452610c39868351610ac7565b95509284019290840190600101610bff565b509398975050505050505050565b600080600060408486031215610c6e57600080fd5b83358015158114610c7e57600080fd5b9250602084013567ffffffffffffffff811115610c9a57600080fd5b610ca686828701610a39565b9497909650939450505050565b838152826020820152606060408201526000610cd26060830184610b2b565b95945050505050565b600060208284031215610ced57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610bca57600080fd5b600060208284031215610d2357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81833603018112610dbc57600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610dfb57600080fd5b83018035915067ffffffffffffffff821115610e1657600080fd5b602001915036819003821315610a7e57600080fd5b8183823760009101908152919050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1833603018112610dbc57600080fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1833603018112610dbc57600080fdfea2646970667358221220eca0cb14f4322010c8eb410ba0738474f94c966328e9db21a580ada159aa6c8564736f6c6343000811003300000000000000c080a086a949d9a5e6c0fca3315b4363c12e9a3953b20445bf0fbe3f659212e7792c92a02e2e4680f844eab38c40aa61874bc199fc45d96ac3d91fe668039df54e060786\"],\"id\":151,\"jsonrpc\":\"2.0\"}", requestMethod="POST", url="http://localhost:8545", code=SERVER_ERROR, version=web/5.7.1)
    at Logger.makeError (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/logger/src.ts/index.ts:269:28)
    at Logger.throwError (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/logger/src.ts/index.ts:281:20)
    at /Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/src.ts/index.ts:341:28
    at step (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:33:23)
    at Object.next (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:14:53)
    at fulfilled (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:5:58)
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  reason: 'processing response error',
  code: 'SERVER_ERROR',
  body: '{"jsonrpc":"2.0","id":151,"error":{"code":-32000,"message":"exceeds block gas limit"}}\n',
  error: Error: exceeds block gas limit
      at getResult (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/providers/src.ts/json-rpc-provider.ts:142:28)
      at processJsonFunc (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/src.ts/index.ts:383:22)
      at /Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/src.ts/index.ts:320:42
      at step (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:33:23)
      at Object.next (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:14:53)
      at fulfilled (/Users/hyunjaelee/work/zksync-era/node_modules/@ethersproject/web/lib/index.js:5:58)
      at processTicksAndRejections (node:internal/process/task_queues:96:5) {
    code: -32000,
    data: undefined
  },
  requestBody: '{"method":"eth_sendRawTransaction","params":["0x02f90fd382300d0284461bffd584461bffd58398968094572b9410d9a14fa729f3af92cb83a07aaa472de080b90f644af63f020000000000000000000000000000000000000000000000000000000000000040fe07c7c6f88cdf003f00c1e47076de3576e136c7114496823271143b3d46e97e0000000000000000000000000000000000000000000000000000000000000ef9608060405234801561001057600080fd5b50610ed9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e1461025a578063bce38bd714610275578063c3077fa914610288578063ee82ac5e1461029b57600080fd5b80634d2301cc146101ec57806372425d9d1461022157806382ad56cb1461023457806386d516e81461024757600080fd5b80633408e470116100c65780633408e47014610191578063399542e9146101a45780633e64a696146101c657806342cbb15c146101d957600080fd5b80630f28c97d146100f8578063174dea711461011a578063252dba421461013a57806327e86d6e1461015b575b600080fd5b34801561010457600080fd5b50425b6040519081526020015b60405180910390f35b61012d610128366004610a85565b6102ba565b6040516101119190610bb7565b61014d610148366004610a85565b6104ef565b604051610111929190610bd1565b34801561016757600080fd5b50437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0140610107565b34801561019d57600080fd5b5046610107565b6101b76101b2366004610c59565b610690565b60405161011193929190610cb3565b3480156101d257600080fd5b5048610107565b3480156101e557600080fd5b5043610107565b3480156101f857600080fd5b50610107610207366004610cdb565b73ffffffffffffffffffffffffffffffffffffffff163190565b34801561022d57600080fd5b5044610107565b61012d610242366004610a85565b6106ab565b34801561025357600080fd5b5045610107565b34801561026657600080fd5b50604051418152602001610111565b61012d610283366004610c59565b61085a565b6101b7610296366004610a85565b610a1a565b3480156102a757600080fd5b506101076102b6366004610d11565b4090565b60606000828067ffffffffffffffff8111156102d8576102d8610d2a565b60405190808252806020026020018201604052801561031e57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f65790505b5092503660005b8281101561047757600085828151811061034157610341610d59565b6020026020010151905087878381811061035d5761035d610d59565b905060200281019061036f9190610d88565b6040810135958601959093506103886020850185610cdb565b73ffffffffffffffffffffffffffffffffffffffff16816103ac6060870187610dc6565b6040516103ba929190610e2b565b60006040518083038185875af1925050503d80600081146103f7576040519150601f19603f3d011682016040523d82523d6000602084013e6103fc565b606091505b50602080850191909152901515808452908501351761046d577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b5050600101610325565b508234146104e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4d756c746963616c6c333a2076616c7565206d69736d6174636800000000000060448201526064015b60405180910390fd5b50505092915050565b436060828067ffffffffffffffff81111561050c5761050c610d2a565b60405190808252806020026020018201604052801561053f57816020015b606081526020019060019003908161052a5790505b5091503660005b8281101561068657600087878381811061056257610562610d59565b90506020028101906105749190610e3b565b92506105836020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166105a66020850185610dc6565b6040516105b4929190610e2b565b6000604051808303816000865af19150503d80600081146105f1576040519150601f19603f3d011682016040523d82523d6000602084013e6105f6565b606091505b5086848151811061060957610609610d59565b602090810291909101015290508061067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b50600101610546565b5050509250929050565b43804060606106a086868661085a565b905093509350939050565b6060818067ffffffffffffffff8111156106c7576106c7610d2a565b60405190808252806020026020018201604052801561070d57816020015b6040805180820190915260008152606060208201528152602001906001900390816106e55790505b5091503660005b828110156104e657600084828151811061073057610730610d59565b6020026020010151905086868381811061074c5761074c610d59565b905060200281019061075e9190610e6f565b925061076d6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166107906040850185610dc6565b60405161079e929190610e2b565b6000604051808303816000865af19150503d80600081146107db576040519150601f19603f3d011682016040523d82523d6000602084013e6107e0565b606091505b506020808401919091529015158083529084013517610851577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b50600101610714565b6060818067ffffffffffffffff81111561087657610876610d2a565b6040519080825280602002602001820160405280156108bc57816020015b6040805180820190915260008152606060208201528152602001906001900390816108945790505b5091503660005b82811015610a105760008482815181106108df576108df610d59565b602002602001015190508686838181106108fb576108fb610d59565b905060200281019061090d9190610e3b565b925061091c6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff1661093f6020850185610dc6565b60405161094d929190610e2b565b6000604051808303816000865af19150503d806000811461098a576040519150601f19603f3d011682016040523d82523d6000602084013e61098f565b606091505b506020830152151581528715610a07578051610a07576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b506001016108c3565b5050509392505050565b6000806060610a2b60018686610690565b919790965090945092505050565b60008083601f840112610a4b57600080fd5b50813567ffffffffffffffff811115610a6357600080fd5b6020830191508360208260051b8501011115610a7e57600080fd5b9250929050565b60008060208385031215610a9857600080fd5b823567ffffffffffffffff811115610aaf57600080fd5b610abb85828601610a39565b90969095509350505050565b6000815180845260005b81811015610aed57602081850181015186830182015201610ad1565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b600082825180855260208086019550808260051b84010181860160005b84811015610baa578583037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001895281518051151584528401516040858501819052610b9681860183610ac7565b9a86019a9450505090830190600101610b48565b5090979650505050505050565b602081526000610bca6020830184610b2b565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610c4b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0888703018452610c39868351610ac7565b95509284019290840190600101610bff565b509398975050505050505050565b600080600060408486031215610c6e57600080fd5b83358015158114610c7e57600080fd5b9250602084013567ffffffffffffffff811115610c9a57600080fd5b610ca686828701610a39565b9497909650939450505050565b838152826020820152606060408201526000610cd26060830184610b2b565b95945050505050565b600060208284031215610ced57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610bca57600080fd5b600060208284031215610d2357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81833603018112610dbc57600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610dfb57600080fd5b83018035915067ffffffffffffffff821115610e1657600080fd5b602001915036819003821315610a7e57600080fd5b8183823760009101908152919050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1833603018112610dbc57600080fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1833603018112610dbc57600080fdfea2646970667358221220eca0cb14f4322010c8eb410ba0738474f94c966328e9db21a580ada159aa6c8564736f6c6343000811003300000000000000c080a086a949d9a5e6c0fca3315b4363c12e9a3953b20445bf0fbe3f659212e7792c92a02e2e4680f844eab38c40aa61874bc199fc45d96ac3d91fe668039df54e060786"],"id":151,"jsonrpc":"2.0"}',
  requestMethod: 'POST',
  url: 'http://localhost:8545',
  transaction: {
    type: 2,
    chainId: 12301,
    nonce: 2,
    maxPriorityFeePerGas: BigNumber { _hex: '0x461bffd5', _isBigNumber: true },
    maxFeePerGas: BigNumber { _hex: '0x461bffd5', _isBigNumber: true },
    gasPrice: null,
    gasLimit: BigNumber { _hex: '0x989680', _isBigNumber: true },
    to: '0x572b9410D9a14Fa729F3af92cB83A07aaA472dE0',
    value: BigNumber { _hex: '0x00', _isBigNumber: true },
    data: '0x4af63f020000000000000000000000000000000000000000000000000000000000000040fe07c7c6f88cdf003f00c1e47076de3576e136c7114496823271143b3d46e97e0000000000000000000000000000000000000000000000000000000000000ef9608060405234801561001057600080fd5b50610ed9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e1461025a578063bce38bd714610275578063c3077fa914610288578063ee82ac5e1461029b57600080fd5b80634d2301cc146101ec57806372425d9d1461022157806382ad56cb1461023457806386d516e81461024757600080fd5b80633408e470116100c65780633408e47014610191578063399542e9146101a45780633e64a696146101c657806342cbb15c146101d957600080fd5b80630f28c97d146100f8578063174dea711461011a578063252dba421461013a57806327e86d6e1461015b575b600080fd5b34801561010457600080fd5b50425b6040519081526020015b60405180910390f35b61012d610128366004610a85565b6102ba565b6040516101119190610bb7565b61014d610148366004610a85565b6104ef565b604051610111929190610bd1565b34801561016757600080fd5b50437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0140610107565b34801561019d57600080fd5b5046610107565b6101b76101b2366004610c59565b610690565b60405161011193929190610cb3565b3480156101d257600080fd5b5048610107565b3480156101e557600080fd5b5043610107565b3480156101f857600080fd5b50610107610207366004610cdb565b73ffffffffffffffffffffffffffffffffffffffff163190565b34801561022d57600080fd5b5044610107565b61012d610242366004610a85565b6106ab565b34801561025357600080fd5b5045610107565b34801561026657600080fd5b50604051418152602001610111565b61012d610283366004610c59565b61085a565b6101b7610296366004610a85565b610a1a565b3480156102a757600080fd5b506101076102b6366004610d11565b4090565b60606000828067ffffffffffffffff8111156102d8576102d8610d2a565b60405190808252806020026020018201604052801561031e57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f65790505b5092503660005b8281101561047757600085828151811061034157610341610d59565b6020026020010151905087878381811061035d5761035d610d59565b905060200281019061036f9190610d88565b6040810135958601959093506103886020850185610cdb565b73ffffffffffffffffffffffffffffffffffffffff16816103ac6060870187610dc6565b6040516103ba929190610e2b565b60006040518083038185875af1925050503d80600081146103f7576040519150601f19603f3d011682016040523d82523d6000602084013e6103fc565b606091505b50602080850191909152901515808452908501351761046d577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b5050600101610325565b508234146104e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4d756c746963616c6c333a2076616c7565206d69736d6174636800000000000060448201526064015b60405180910390fd5b50505092915050565b436060828067ffffffffffffffff81111561050c5761050c610d2a565b60405190808252806020026020018201604052801561053f57816020015b606081526020019060019003908161052a5790505b5091503660005b8281101561068657600087878381811061056257610562610d59565b90506020028101906105749190610e3b565b92506105836020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166105a66020850185610dc6565b6040516105b4929190610e2b565b6000604051808303816000865af19150503d80600081146105f1576040519150601f19603f3d011682016040523d82523d6000602084013e6105f6565b606091505b5086848151811061060957610609610d59565b602090810291909101015290508061067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b50600101610546565b5050509250929050565b43804060606106a086868661085a565b905093509350939050565b6060818067ffffffffffffffff8111156106c7576106c7610d2a565b60405190808252806020026020018201604052801561070d57816020015b6040805180820190915260008152606060208201528152602001906001900390816106e55790505b5091503660005b828110156104e657600084828151811061073057610730610d59565b6020026020010151905086868381811061074c5761074c610d59565b905060200281019061075e9190610e6f565b925061076d6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff166107906040850185610dc6565b60405161079e929190610e2b565b6000604051808303816000865af19150503d80600081146107db576040519150601f19603f3d011682016040523d82523d6000602084013e6107e0565b606091505b506020808401919091529015158083529084013517610851577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b50600101610714565b6060818067ffffffffffffffff81111561087657610876610d2a565b6040519080825280602002602001820160405280156108bc57816020015b6040805180820190915260008152606060208201528152602001906001900390816108945790505b5091503660005b82811015610a105760008482815181106108df576108df610d59565b602002602001015190508686838181106108fb576108fb610d59565b905060200281019061090d9190610e3b565b925061091c6020840184610cdb565b73ffffffffffffffffffffffffffffffffffffffff1661093f6020850185610dc6565b60405161094d929190610e2b565b6000604051808303816000865af19150503d806000811461098a576040519150601f19603f3d011682016040523d82523d6000602084013e61098f565b606091505b506020830152151581528715610a07578051610a07576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b506001016108c3565b5050509392505050565b6000806060610a2b60018686610690565b919790965090945092505050565b60008083601f840112610a4b57600080fd5b50813567ffffffffffffffff811115610a6357600080fd5b6020830191508360208260051b8501011115610a7e57600080fd5b9250929050565b60008060208385031215610a9857600080fd5b823567ffffffffffffffff811115610aaf57600080fd5b610abb85828601610a39565b90969095509350505050565b6000815180845260005b81811015610aed57602081850181015186830182015201610ad1565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b600082825180855260208086019550808260051b84010181860160005b84811015610baa578583037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001895281518051151584528401516040858501819052610b9681860183610ac7565b9a86019a9450505090830190600101610b48565b5090979650505050505050565b602081526000610bca6020830184610b2b565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610c4b577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0888703018452610c39868351610ac7565b95509284019290840190600101610bff565b509398975050505050505050565b600080600060408486031215610c6e57600080fd5b83358015158114610c7e57600080fd5b9250602084013567ffffffffffffffff811115610c9a57600080fd5b610ca686828701610a39565b9497909650939450505050565b838152826020820152606060408201526000610cd26060830184610b2b565b95945050505050565b600060208284031215610ced57600080fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610bca57600080fd5b600060208284031215610d2357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81833603018112610dbc57600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610dfb57600080fd5b83018035915067ffffffffffffffff821115610e1657600080fd5b602001915036819003821315610a7e57600080fd5b8183823760009101908152919050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1833603018112610dbc57600080fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1833603018112610dbc57600080fdfea2646970667358221220eca0cb14f4322010c8eb410ba0738474f94c966328e9db21a580ada159aa6c8564736f6c6343000811003300000000000000',
    accessList: [],
    hash: '0x7893259b825674bcb88e9fe491b4390d5f70b8a807cdc57169470db07f431c6c',
    v: 0,
    r: '0x86a949d9a5e6c0fca3315b4363c12e9a3953b20445bf0fbe3f659212e7792c92',
    s: '0x2e2e4680f844eab38c40aa61874bc199fc45d96ac3d91fe668039df54e060786',
    from: '0x52312AD6f01657413b2eaE9287f6B9ADaD93D5FE',
    confirmations: 0
  },
  transactionHash: '0x7893259b825674bcb88e9fe491b4390d5f70b8a807cdc57169470db07f431c6c'
}
error Command failed with exit code 1.
```

### hardhat-gas-reporter
hardhat.config.ts 참고: https://github.com/poohgithub/zksync-era/blob/main/poohnet/paymaster-examples/contracts/hardhat.config.ts



-------
## Git
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※


### error: cannot run delta: No such file or directory

🏆 해결
```
brew install git-delta
```
```
sudo apt install git-extras
```
이렇게 해도 git diff는 안되기 때문에 git-delta 명령만 사용하기 
-------
### fatal: Not possible to fast-forward, aborting.

🏆 해결
```
git fetch origin
git rebase origin/main
```
-------
## Dev Errors
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### failed to compute cache key: "/target/debug/zksync_server" not found: not found
Error: Child process exited with code 1

🏆 해결
- .dockerignore에서 포함되어 있는 것은 아닌지 확인 필요
- 만약 로컬 시스템에서 복사되는 것이라면 원래 없는 것일 수도 있음. 예를 들어 컴파일을 해야 나오는 파일이던가 하면 그런일이 발생

---
## Errors
### 1. Error: VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)
- 연산이 음수가 될 때, 찬반표 계산시 발생


### 2.  Error: cannot estimate gas; transaction may fail or may require manual gas limit (error="Error: VM Exception while processing transaction: reverted with reason string 'E004'"
```
Error: cannot estimate gas; transaction may fail or may require manual gas limit (error="Error: VM Exception while processing transaction: reverted with reason string 'E004'", tx={"data":"0x1e28886e3a38e54d9c9b01a63cae0476c624f670359871e7b1463a777cba3247240e31fd76129d005b6f526cbaaf1e1e37494d8091c109bfcf47881a612190af683c1e27000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000412dcb94cce59dd93b63aae7cedc6f7f0b64083b6a29b6f8ce403b2b8f862d8a5a17a797b880310346766ca58d2b9a01b4060b3bfcd7ad02c9aec7da9cd41f77431b00000000000000000000000000000000000000000000000000000000000000","to":{},"from":"0x0e1eE98EDF5BDbc5caaFed491526A0Cd3eD31fad","type":2,"maxFeePerGas":{"type":"BigNumber","hex":"0xa650c80c"},"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x9502f900"},"nonce":{},"gasLimit":{},"chainId":{}}, code=UNPREDICTABLE_GAS_LIMIT, version=abstract-signer/5.5.0)
```

### 3. Error: cannot estimate gas; transaction may fail or may require manual gas limit
```
Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (error={"reason":"VM Exception while processing transaction: reverted with reason string 'E000'","code":"UNPREDICTABLE_GAS_LIMIT","method":"estimateGas","transaction":{"from":"0x3287f4b4953471234DbeAFf7d2F9EA58dFedD7fd","maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x59682f00"},"maxFeePerGas":{"type":"BigNumber","hex":"0xa80d7dfe"},"to":"0xeEdC2Ac65dF232AB6d229EBD4E3F564e194ffe7D","value":{"type":"BigNumber","hex":"0x056bc75e2d63100000"},
```

- 이코드에서 발생 "IVoteraVote(voteAddress).init("
- 이 함수를 CommonsBudget에서 호출되어야하는데, CommonsStorage에서 호출되어서 initVote에서 문제가 발생.


### 4. AssertionError: Expected transaction to be reverted with E001, but other exception was thrown: RangeError: Maximum call stack size exceeded
	a. typechain 모듈 업그레이드
	b. 이 커밋 참조
### 5. TypeError: Cannot read property 'eth' of undefined [closed]
	○ 이 코드 실행시 발생
		§ hre.web3.eth.accounts.decrypt(data,"boa2022!@");
	○ 다음 설치 필요
		§ npm install -s web3
		§ npm install -s @nomiclabs/hardhat-web3
	○ hardhat.config.ts에서 다음 추가
		§ import"@nomiclabs/hardhat-web3";
	○ 결국 hardhat과 web3를 연결하는 작업이 필요함.


### 6. HardhatError: HH103: Account 0x3e29aefa7af16625691a9fca4a7fff0624aabc6f is not managed by the node you are connected to.
hardhat.config.ts의 getAccounts함수에 해당 계좌를 추가해야함.
```
§ accounts:[process.env.ADMIN_KEY||"",process.env.VOTE_KEY||"",process.env.USER_KEY||"",process.env.MANAGER_KEY||""],
```
### 7. docker: Got permission denied while trying to connect to the Docker daemon socket
- 이건 screen에 들어가서 실행해줘야 함.
```
1.Create the docker group if it does not exist
$ sudo groupadd docker
2.Add your user to the docker group.
$ sudo usermod -aG docker $USER
3.Run the following command or Logout and login again and run (that doesn't work you may need to reboot your machine first)
$ newgrp docker
```
### 8. Authority노드를 실행시킬때, block number가 늘어나지 않을때
- run_node를 통해서 실행시키면 다음과 같은 내부 IP에 대한 로그가 나와도 문제는 아님.
```
self=enode://6d59a1ce195d9251e8f5234b3dbd486cf15eeac6cb8199898af3e11b9b7f5c54e334317d1cc3ab8077360383bc08b8aa93299ccb169b55dbea59414847dbce2d@127.0.0.1:30303
```
- run_node 스크립트에 bootnode 항목에 들어가는 enode의 IP값이 맞아야 함.
- static_node.json에 enode 정보를 정확히 써줘야 함.
- Node1에 외부 IP를 할당했을때 재부팅 필요함.
- 싱크하는데 시간이 좀 걸림.

###  9. Merge pull request #1 from linked0/initial-code
	® 두번째 커밋은 <Hyunjae Lee>이고, 세번째 커밋은 <Jay>로 되어 있음.

### 10. 이미 임포트된 계정이 있는데 다시 임포트를 하려고할 때 에러가 뜨는데 관련 설명
```
Imported Accounts are accounts you import using a private key string or a private key JSON file, and were not created with the same Secret Recovery Phrase as your wallet and accounts. For this reason, these accounts will not appear automatically when you restore your MetaMask account with your Secret Recovery Phrase. The data associated with your MetaMask Secret Recovery Phrase cannot be added or extended to the imported account.
```

### 11. An unexpected error occurred:
Error: Cannot find module './IERC165__factory'
• 해결: typechain-types와 artifacts 폴더 삭제
• 상세 내용
```
Require stack:
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/utils/introspection/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/utils/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/typechain-types/index.ts
- /Users/hyunjaelee/work/commons-budget-contract/test/VoteHelper.ts
- /Users/hyunjaelee/work/commons-budget-contract/test/AdminAction.test.ts
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/node_modules/mocha/lib/mocha.js
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/node_modules/mocha/index.js
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/builtin-tasks/test.js
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/core/tasks/builtin-tasks.js
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/core/config/config-loading.js
- /Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/cli/cli.js
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
    at Function.Module._resolveFilename.sharedData.moduleResolveFilenameHook.installedValue [as _resolveFilename] (/Users/hyunjaelee/work/commons-budget-contract/node_modules/@cspotcode/source-map-support/source-map-support.js:679:30)
    at Function.Module._load (node:internal/modules/cjs/loader:778:27)
    at Module.require (node:internal/modules/cjs/loader:1005:19)
    at require (node:internal/modules/cjs/helpers:102:18)
    at Object.<anonymous> (/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/utils/introspection/index.ts:4:1)
    at Module._compile (node:internal/modules/cjs/loader:1105:14)
    at Module.m._compile (/Users/hyunjaelee/work/commons-budget-contract/node_modules/ts-node/src/index.ts:1459:23)
    at Module._extensions..js (node:internal/modules/cjs/loader:1159:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/hyunjaelee/work/commons-budget-contract/node_modules/ts-node/src/index.ts:1462:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/utils/introspection/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/utils/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/contracts/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/@openzeppelin/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/factories/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/typechain-types/index.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/test/VoteHelper.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/test/AdminAction.test.ts',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/node_modules/mocha/lib/mocha.js',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/node_modules/mocha/index.js',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/builtin-tasks/test.js',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/core/tasks/builtin-tasks.js',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/core/config/config-loading.js',
    '/Users/hyunjaelee/work/commons-budget-contract/node_modules/hardhat/internal/cli/cli.js'
  ]
}
```

### 12.  Unexpected end of JSON input 에러
* npx hardhat run scripts/deploy.ts --network devnet 실행시 발생

* 해결방법: Delete currupted find, hardhat clean & reinstall
	- cd /home/ubuntu/.cache/hardhat-nodejs/compilers/linux-amd64
	- rm list.json
	- npx hardhat clean <-- 원래 폴더로 돌아와서.
	- yarn install
	- yarn build

* 에러 내용 I
```
An unexpected error occurred:

SyntaxError: /Users/hyunjaelee/work/commons-budget-contract/artifacts/@openzeppelin/contracts/utils/Context.sol/Context.dbg.json: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at /Users/hyunjaelee/work/commons-budget-contract/node_modules/jsonfile/index.js:33:18
    at /Users/hyunjaelee/work/commons-budget-contract/node_modules/graceful-fs/graceful-fs.js:123:16
    at FSReqCallback.readFileAfterClose [as oncomplete] (node:internal/fs/read_file_context:68:3)
```

* 에러 내용 II
```
yarn run v1.22.22
$ hardhat run --network devnet scripts/deploy-factory.js
An unexpected error occurred:

SyntaxError: /home/ubuntu/.cache/hardhat-nodejs/compilers/linux-amd64/list.json: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at /home/ubuntu/tigger-swap/node_modules/jsonfile/index.js:33:18
    at /home/ubuntu/tigger-swap/node_modules/graceful-fs/graceful-fs.js:123:16
    at FSReqCallback.readFileAfterClose [as oncomplete] (node:internal/fs/read/context:68:3)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### 13. HardhatError: HH103: Account 0x3e29aefa7af16625691a9fca4a7fff0624aabc6f is not managed by the node you are connected to.
* 발생시점: npx hardhat run scripts/set_owner.ts --network testnet
* 해결: hardhat.config.ts에서만 세팅한 계정만 사용할 수 있음.

### 14. TypeError: Cannot read properties of undefined (reading 'sourceName')
- 발생시점: `yarn test`로 fulfillOrder 테스트
- 해결: yarn add --dev hardhat@ir
- 에러 상세내용
```
/Users/hyunjaelee/work/seaport/node_modules/hardhat/internal/hardhat-network/stack-traces/solidity-errors.js:111
    return new SolidityCallSite(sourceReference.sourceName, sourceReference.contract, sourceReference.function !== undefined
                                                ^
TypeError: Cannot read properties of undefined (reading 'sourceName')
(Use `node --trace-uncaught ...` to show where the exception was thrown)
error Command failed with exit code 7.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### 15. <UnrecognizedContract>.<unknown> 

- Seaport 테스트 코드 작성시 문제 생김
- 테스트코드에서 컨트랙트 함수 호출시 signer로 connect해야하는데 그냥 wallet으로 connect 함
- Hardhat 네트워크에서 사용할 계정은 hardhat.config.ts의 getAccount함수에서 추가하면 됨.

### 16. Uncaught ReferenceError: Buffer is not defined
여기 스텍오버플로우 참조
```
import{ Buffer} from'buffer';
// @ts-ignorewindow.Buffer= Buffer;
```

17. Error HH700: Artifact for contract "hardhat/console.sol:console" not found. 
  * npx hardhat clean 실행
	
18. TestNet에서 Contract 배포시 UND_ERR_CONNECT_TIMEOUT이 발생
  * 다음과 같이 처리됨
  * RPC를 다른 노드에 붙임
  * 문제가 생긴 노드를 트랜잭션 풀을 날려버림

### 19. TestNet에서 Contract 배포 스크립트 실행시 다음 프롬프트로 안 떨어지고 먹통]
  * Nonce값이 꼬여서 그렇게 됨
  * Nonce값이 꼬인 이유는 내 개인 프로젝트인 web2/nft-market에서 NonceManager를 사용하지 않아서 생긴 문제
  * 일단 문제가 생긴 계정(즉 Contract를 배포하던 주소)에서 네이티브 토큰을 보내기 몇번하면 됨.

### 20. npm ERR! code EINTEGRITY
```
npm ERR! sha1-UzRK2xRhehP26N0s4okF0cC6MhU=sha512-XWwnNNFCuuSQ0m3r3C4LE3EiORltHd9M05pq6FOlVeiophzRbMo50Sbz1ehl8K3Z+jw9+vmgnXefY1hz8X+2wA== integrity checksum failed when using sha1: wanted sha1-UzRK2xRhehP26N0s4okF0cC6MhU=sha512-XWwnNNFCuuSQ0m3r3C4LE3EiORltHd9M05pq6FOlVeiophzRbMo50Sbz1ehl8K3Z+jw9+vmgnXefY1hz8X+2wA== but got sha512-XWwnNNFCuuSQ0m3r3C4LE3EiORltHd9M05pq6FOlVeiophzRbMo50Sbz1ehl8K3Z+jw9+vmgnXefY1hz8X+2wA== sha1-UzRK2xRhehP26N0s4okF0cC6MhU=. (42300 bytes)
```
  * yarn install을 써야하는 곳에서 npm install을 썼을때 나타남

### 21. Error: error:0308010C:digital envelope routines::unsupported
#### 에러 내용
- hardhat compile --config ./hardhat.config.ts
- An unexpected error occurred:

```
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:67:19)
    at createHash (node:crypto:133:10)
    at ripemd160 (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/sha2/src.ts/sha2.ts:14:29)
    at new HDNode (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/hdnode/src.ts/index.ts:115:67)
    at Function.HDNode._fromSeed (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/hdnode/src.ts/index.ts:258:16)
    at Function.HDNode.fromMnemonic (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/hdnode/src.ts/index.ts:269:23)
    at Function.Wallet.fromMnemonic (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/wallet/src.ts/index.ts:192:34)
    at Function.Wallet.createRandom (/Users/hyunjaelee/work/pooh-land/node_modules/@ethersproject/wallet/src.ts/index.ts:177:23)
    at getAccounts (/Users/hyunjaelee/work/pooh-land/hardhat.config.ts:35:26)
    at Object.<anonymous> (/Users/hyunjaelee/work/pooh-land/hardhat.config.ts:116:17) {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
```

#### 해결
export NODE_OPTIONS=--openssl-legacy-provider

### 22. jiyoungminjung으로 처음에 push를 하려고할때 권한 문제 발생
* 에러 내용
To github.com:jiyoungminjung/pooh-land-js.git
 ! [remote rejected] readme -> readme (permission denied)
error: failed to push some refs to 'git@github.com:jiyoungminjung/pooh-land-js.git'
* 해결
  - jiyoungminjung의 계정 setting에서 SSH key를 등록함.

### 23. BigInt 인식 못하는 문제
관련 github repo: github.com:poohgithub/pooh-swap-v2-core.git
```
const swapTestCases: BigInt[][] = [
   [1, 5, 10, '1662497915624478906'],
   [1, 10, 5, '453305446940074565'],


   [2, 5, 10, '2851015155847869602'],
   [2, 10, 5, '831248957812239453'],


   [1, 10, 10, '906610893880149131'],
   [1, 100, 100, '987158034397061298'],
   [1, 1000, 1000, '996006981039903216']
 ].map(a => a.map(n => (typeof n === 'string' ? BigInt(n) : BigInt(n * 10 ** 18))));
 swapTestCases.forEach((swapTestCase, i) => {
   it(`getInputPrices:${i}`, async () => {
     const swapAmount = BigInt(swapTestCase[0].toString());
     const token0Amount = BigInt(swapTestCase[1].toString());
     const token1Amount = BigInt(swapTestCase[2].toString());
     const expectedOutputAmount = BigInt(swapTestCase[3].toString());
     await addLiquidity(token0Amount, token1Amount);
     await token0.transfer(pair.target, swapAmount);
     await expect(pair.swap(0, expectedOutputAmount + 1n, admin.address, '0x', overrides)).to.be.revertedWith('UniswapV2: K');
     await pair.swap(0, expectedOutputAmount, admin.address, '0x', overrides);


   });
 });
```

## Codes
### Solidity의 `address` type이 TypeScript에서는 `string`

### TypeScript 프로그램에 파라미터 추가
```
async function main() {
  const parameter = process.env.PARAMETER;
  console.log("Received parameter:", parameter);

  // Your deployment or other script logic here
}
```

```
PARAMETER=value npx hardhat run deploy.ts
```

### Agora Locanet 실행
- 사용자 root 폴더에 git@github.com:bosagora/agoranet.git 소스 다운로드((사용자 루트 폴더에 클로닝 해야함)
- cd ~/agoranet/michal/
- docker 실행
- cmd/el/init_node 1 실행
	- sudo가 들어가 있어서 개인 PC 암호가 필요함.
- cmd/el/run_node 1
	- LOCALNET_URL=http://127.0.0.1:8545
· chain id: 34559
· Admin에 돈을 넣어주기
	- 방법: 돈을 이미 가지고 있는 키를 주신다고 함.
	- 0xb16ae920b229e39555024802925f663071625a998cb1c0ecf88878841fa748e6
· CommonsBudget 배포
· config/el/genesis_bosagora.json에 다음과 값 세팅
	- bosagoraBlock: 커먼스 버짓 발행의 시작될 블럭, 배포된 블럭의 20~30개 이후 적당.
	- commonsBudget: 배포된 CommonsBudget Address

### Subgraph 개발시 걸린 시간: 딱 10일
개요: 문서 파악이 3일, 테스트가 4일, 실제 개발: 3일
Post Mortem
  - 문서에 대한 좀 더 꼼꼼한 분석이 필요 했음. 
  - chatGPT로 인해서 개발기간이 1/3로 단축됨

1. 목/금/화(2/9~10, 2/14): Graph 구조 파악
2. 수(2/15): 실제 실행 관련 자료 조사
3. 목/금(2/16~17): Goerli/local 노드에서 예제 돌려보기
4. 월(20): 테스트넷 예제 컨트랙트 테스트
5. 화/수(21~22): ERC1155/ERC721/AssetContract에 대한 테스트 완료
6. 목(23): 테스트넷에서 스키마 및 매핑 1차 개발 완료

### hardhat 프로젝트 개발시 참고
- https://hardhat.org/migrate-from-waffle

### 개념
- const receipt = await (await tx).wait();
	§ tx는 sendTransaction()에서 리턴한 Promise이다.

### Solidity version
· 가장 확실한 형태
  ○ pragma solidity >=0.8.0 <=0.8.10;
· pragma solidity ^0.5.2;
  ○ 0.5.2 이전 버전 컴파일러로는 컴파일 안됨
  ○ 0.6.0 으로 시작되는 버전에는 컴파일 암됨 (^가 그런 의미임)

### harthat 프로젝트 만들기
In our case we created the folder named ProjetoLivroNFTERC1155OZ. 
1) Start npm in standard mode.
  npm init -y 
2) Install the hardhat.
  npm install --save-dev hardhat 
  yarn add --dev hardhat <== yarn으로 인스톨할 경우.
3) Install OpenZeppelin smart contracts.
  npm install @openzeppelin/contracts 
4) Install required modules and dependencies. 
  npm install --save-dev @nomiclabs/hardhat-waffle npm install --save-dev "@nomiclabs/hardhat-ethers@^2.0.0" "ethereum- waffle@^3.4.0" "ethers@^5.0.0" 
5) Install the dotenv module.
  npm install dotenv 
6) Start the hardhat.
  npx hardhat

### delegatecall 관하여
<a href="https://medium.com/coinmonks/delegatecall-calling-another-contract-function-in-solidity-b579f804178c">Medium delegatecall</a>
<a href="https://kristaps.me/blog/solidity-delegatecall-proxy-pattern/">Preventing Vulnerabilities in Solidity - Delegate Call</a>
<a href="https://ethereum.stackexchange.com/questions/90917/delegate-call-msg-sender-wrong-value">Stackexchange</a>
<a href="https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html">Solidity storage</a>
<a href="https://betterprogramming.pub/all-about-solidity-data-locations-part-i-storage-e50604bfc1ad">Storage slot in Inheritance</a>


pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Executor {
  uint256 public luckyNumber;
  address public sender;
  uint256 public value;

  function setLuckyNumber(uint256 _luckyNumber) public payable {
    luckyNumber = _luckyNumber;
    sender = msg.sender;
    value = msg.value;
  }

  function showNumber() public {
    console.log("luckeyNumber:", luckyNumber);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
contract Caller {
  function setLuckyNumber(address executor, uint256 _luckyNumber) public payable {
    (bool success, bytes memory data) = executor.delegatecall(
      abi.encodeWithSignature("setLuckyNumber(uint256)", _luckyNumber)
    );
  }
  function showNumber(address executor) public {
    (bool success, bytes memory data) = executor.delegatecall(
      abi.encodeWithSignature("showNumber()")
    );
  }
}

### static call
staticcall works in a similar way as a normal call (without any value (sending eth) as this would change state). But when staticcall is used, the EVM has a STATIC flag set to true. Then, if any state modification is attempted, an exception is thrown. Once the staticcall returns, the flag is turned off.

### npm publish, NPM module 배포, 모듈 배포
1. 본인의 npm node 프로젝트 루트 폴더를 들어가서 "npm login" 명령 실행
2. NPM 페이지에서 로그인 진행, Google Authenticator 필요
3. 다시 프로젝트 루트 폴더에서 "npm publish" 명령 실행
4. NPM 페이지에서 배포 진행, Google Authenticator 필요

### Transaction의 형태
transaction: {
  hash: '0x4508d350b89655c9452d527ff1b3d307ed566228661b0a805567561ebc7590f1',
  type: 2,
  accessList: [],
  blockHash: '0xb0f9792fbe40b2b9c85fbdabb90e7f0e4ee08f82f9f82ef485814d3002a34c8f',
  blockNumber: 59,
  transactionIndex: 0,
  confirmations: 1,
  from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  gasPrice: BigNumber { value: "1000591199" },
  maxPriorityFeePerGas: BigNumber { value: "1000000000" },
  maxFeePerGas: BigNumber { value: "1001182398" },
  gasLimit: BigNumber { value: "211019" },
  to: '0x09635F643e140090A9A8Dcd712eD6285858ceBef',
  value: BigNumber { value: "0" },
  nonce: 3,
  data: '0xe7acab24000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000005600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004c0000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000063be212dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ea4da12fc3f3f34300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000006509f2a854ba7441039fce3b959d5badd2ffcfcd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000008ac7230489e800000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000300000000000000000000000033c0024ebc7a8989c1ae32988d5402295c8fd42b3c44cdddb6a900fa2b585dd299e03d12fa4293bc000000000000010000000064000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000010000000000000000000000006509f2a854ba7441039fce3b959d5badd2ffcfcd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003782dace9d9000000000000000000000000000000000000000000000000000003782dace9d9000000000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c800000000000000000000000000000000000000000000000000000000000000401fb0dfbaf5bce7c5a92402efbcec0e173531b3e3378e7b236a83eda892e6ac0603ef19202e3b2217622f4a881609e592f598fde0d14849af8b0fb024b71de187000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007f688786',
  r: '0xe41292838da7454d5932feef08cb49c12e56721edfab2df873d79abaf35fed26',
  s: '0x2a9cf276597a3559d1784c95234ff0c0805e4b29e846ccbe13e59fb3f0874f2a',
  v: 0,
  creates: null,
  chainId: 1,
  wait: [Function (anonymous)]
}

### sendTransaction - hardhat 테스트 코드
const encodedData = feeCollectorContract.interface.encodeFunctionData(
  "unwrapAndWithdraw",
  [
    feeAdmin.address.toString(),
    wboaContract.address,
    BigNumber.from("10")
  ]
);
const result = await ownerSigner.sendTransaction({
  to: proxyContract.address,
  data: encodedData
});

- 관련 사이트
https://ethereum.stackexchange.com/questions/54845/calling-contract-function-via-web3-eth-sendtransaction-doesnt-work
https://stackoverflow.com/questions/72584559/how-to-test-the-solidity-fallback-function-via-hardhat
https://github.com/ethers-io/ethers.js/issues/478
https://ethereum.stackexchange.com/questions/114146/how-do-i-manually-encode-and-send-transaction-data
https://github.com/ethers-io/ethers.js/issues/3522


### Predicted Address
contract C {
        functioncreateDSalted(bytes32 salt, uint arg) public {
            // This complicated expression just tells you how the address
	// can be pre-computed. It is just there for illustration.
	// You actually only need ``new D{salt: salt}(arg)``.
	address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(abi.encodePacked(
                    type(D).creationCode,
                    abi.encode(arg)
                ))
            )))));

            D d = newD{salt: salt}(arg);
            require(address(d) == predictedAddress);
        }
    }
	}


### 컨트랙트 사이즈
	1. npm install --dev hardhat-contract-sizer
	2. hardhat.config.ts에 다음 라인 추가
		○ import "hardhat-contract-sizer";
	3. npx hardhat size-contracts

### 옛날 방식
solc-select install 0.8.0

truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};

data = fs.readFileSync('/Users/hyunjaelee/work/commons-budget-contract/build/contracts/VoteraVote.json');
obj = JSON.parse(data);
size = Buffer.byteLength(obj.deployedBytecode) / 2;

### Nonce 오류 관련해서 헨리님이 얘기해준것
private async resetTransactionCount() {
  this.manager_signer.setTransactionCount(await this.manager_signer.getTransactionCount());
}
3:42
nonce-manager.ts
setTransactionCount(transactionCount: ethers.BigNumberish | Promise<ethers.BigNumberish>): void {
  this._initialPromise = Promise.resolve(transactionCount).then((nonce) => {
      return ethers.BigNumber.from(nonce).toNumber();
  });
  this._deltaCount = 0;

### TODO: boa-space-contracts conduit 관련 assembly 코드 (#conduit.spec.ts)
- 관련에러
```
Error: call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ]      (method="getDomain(bytes4,uint256)")
`boa-space-contracts`      프로젝트, conduit.spec.ts 1079라인 에러. 자세한 내용은 web/solidity.html에서      `#conduit.spec.ts`로 검색 => test.yml 원복해서 해보기(Run Linters, Run Reference      Tests, Run "
```

- conduit.spec.ts 아래 코드에서 에러남
```
  it.only("Reverts when attempting to execute transfers on a conduit when not called from a channel", async () => {
    const expectedRevertReason =
      getCustomRevertSelector("ChannelClosed(address)") +
      owner.address.slice(2).padStart(64, "0").toLowerCase();

    const tx = await conduitOne.connect(owner).populateTransaction.execute([]);
    const returnData = await provider.call(tx);
    expect(returnData).to.equal(expectedRevertReason);

    await expect(conduitOne.connect(owner).execute([])).to.be.reverted;
  });
```
- Conduit.sol
```
modifier onlyOpenChannel() {
        console.log("onlyOpenChannel");
        // Utilize assembly to access channel storage mapping directly.
        assembly {
            // Write the caller to scratch space.
            mstore(ChannelKey_channel_ptr, caller())

            // Write the storage slot for _channels to scratch space.
            mstore(ChannelKey_slot_ptr, _channels.slot)

            // Derive the position in storage of _channels[msg.sender]
            // and check if the stored value is zero.
            if iszero(
                sload(keccak256(ChannelKey_channel_ptr, ChannelKey_length))
            ) {
                // The caller is not an open channel; revert with
                // ChannelClosed(caller). First, set error signature in memory.
                mstore(ChannelClosed_error_ptr, ChannelClosed_error_signature)

                // Next, set the caller as the argument.
                mstore(ChannelClosed_channel_ptr, caller())

                // Finally, revert, returning full custom error with argument.
                revert(ChannelClosed_error_ptr, ChannelClosed_error_length)
            }
        }

        console.log("onlyOpenChannel return");
        // Continue with function execution.
        _;
    }
```


---
- https://bit.ly/3MT0VRb
- https://bit.ly/3MVG5AN
- [solidkty markdown](./solidity.md)


# #2. Jay's code sneppets

**latest forge**
```
yarn cache clean --force

vm.expectRever(
  abi.encodeWithSelector(
    Raffle.Raffle__UpkeepNotNeeded.selector,
      ...
    )
} 

vm.recordLogs();
Vm.Log[] memory entries = vm.getRecordedLogs();

forge sanpshot -m testWithrawFromMultipleFunders
```

```
vm.txGasPrice(GAS_PRICE);
uint256 gasStart = gasleft();

uint256 gasEnd = gasleft();
uint256 gasUsed = (gasStart - gasEnd) * tx.gasprice;
```

```
forge inspect FundMe storageLayout
cast storage 0x...(Contract address) 써보기
cast --to-wei 15
cast balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
배포 스크립트 실행시에는 --broadcast를 써야 함.

cast --calldata-decode "fund()" 0xa7ea5e4e

파이선 인터프러터 모드 같은 것.
chisel - Test and receive verbose feedback on Solidity inputs within a REPL environment.
```

**latest hardhat**

**기타: reset array 등**

```
uint16 타입도 있음.

constructor (..., vrfCoordinator, ...) VRFConsumerBaseV2(vrfCoordinator) {
...
}

% 연산자도 있음.

address payable winner = s_players[indexOfWinner];

resetting!
s_players = new address payable[](0);

event WinnerPicked(address indexed winner);
This allows these parameters to be searchable when looking through the blockchain logs. 
```

**abi.decode**
```
function addPerson(bytes calldata data) external {
    // Assuming `data` is ABI-encoded with (string, uint8)
    (string memory name, uint8 age) = abi.decode(data, (string, uint8));

    // Store the information in the contract's state
    people[msg.sender] = Person(name, age);

    // Emit an event to log the addition
    emit PersonAdded(msg.sender, name, age);
}
```

**slot.value**
```
function upgrade(address implementation_) external virtual {
    require(_isValidSigner(msg.sender), "Caller is not owner");
    require(implementation_ != address(0), "Invalid implementation address");
    ++state;
    StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = implementation_;
}
```

**Promise.all && map**
```
await Promise.all(Array.from({ length: 14 }, (_, i) => i).map((i) => claimTopicsRegistry.addClaimTopic(i)));
```

**signMessage**
```
// 이건 ethers v5용이라 참고용
claimForBob.signature = await claimIssuerSigningKey.signMessage(
  ethers.utils.arrayify(
    ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(['address', 'uint256', 'bytes'], [claimForBob.identity, claimForBob.topic, claimForBob.data]),
    ),
  ),
);

// ethers v6
const signature = await signer.signMessage(
  ethers.toBeArray(
    ethers.solidityPackedKeccak256(
      ["bytes32", "address", "uint256"],
      [
        SIGNATURE_DELEGATION_HASH_TYPE,
        delegates[index]!.address,
        endTimestamp,
      ],
    ),
  ),
);
```

**참고할 내용 많음**
```
function cheaperWithdraw() public onlyOwner {
    address[] memory funders = s_funders;
    // mappings can't be in memory, sorry!
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
        address funder = funders[funderIndex];
        s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    // payable(msg.sender).transfer(address(this).balance);
    (bool success,) = i_owner.call{value: address(this).balance}("");
    require(success);
}
```

**CALLDATA**
```
CALLDATACOPY(t, f, s): msg.data 의 f번째 위치에서 s개의 바이트를 읽어 메모리의 t번째 위치에 저장합니다.
create2(
  callvalue(), // wei sent with current call
  // Actual code starts after skipping the first 32 bytes
  add(bytecode, 0x20),
  (bytecode), // Load the size of code contained in the first 32 bytes
   _salt // Salt from function arguments
)
```

**Make sure that we can transfer out token 200**
```
vm.prank(owner4);
IERC6551Executable(account4).execute(
    address(account3),
    0,
    abi.encodeWithSignature(
        "execute(address,uint256,bytes,uint8)",
        address(nft),
        0,
        abi.encodeWithSignature(
            "safeTransferFrom(address,address,uint256)", account3, newTokenOwner, 200
        ),
        0
    ),
    0
);

function callTransfer(address _token, address _to, uint256 _amount) external {
    // This will encode the function call to `transfer(address,uint256)` with the specified arguments
    bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", _to, _amount);
    // Making the actual call to the token contract's transfer function
    (bool success, ) = _token.call(data);
    require(success, "Transfer failed");
}
```

**Nick's Factory**
```
The registry MUST be deployed at address 0x000000006551c19487814612e58FE06813775758 using Nick’s Factory (0x4e59b44847b379578588920cA78FbF26c0B4956C) with salt 0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31.
The registry can be deployed to any EVM-compatible chain using the following transaction:

{
        "to": "0x4e59b44847b379578588920ca78fbf26c0b4956c",
        "value": "0x0",
        "data": "0x0000000000000000000000000000000000000000fd8eb4e1dca713016c518e31608060405234801561001057600080fd5b5061023b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063246a00211461003b5780638a54c52f1461006a575b600080fd5b61004e6100493660046101b7565b61007d565b6040516001600160a01b03909116815260200160405180910390f35b61004e6100783660046101b7565b6100e1565b600060806024608c376e5af43d82803e903d91602b57fd5bf3606c5285605d52733d60ad80600a3d3981f3363d3d373d3d3d363d7360495260ff60005360b76055206035523060601b60015284601552605560002060601b60601c60005260206000f35b600060806024608c376e5af43d82803e903d91602b57fd5bf3606c5285605d52733d60ad80600a3d3981f3363d3d373d3d3d363d7360495260ff60005360b76055206035523060601b600152846015526055600020803b61018b578560b760556000f580610157576320188a596000526004601cfd5b80606c52508284887f79f19b3655ee38b1ce526556b7731a20c8f218fbda4a3990b6cc4172fdf887226060606ca46020606cf35b8060601b60601c60005260206000f35b80356001600160a01b03811681146101b257600080fd5b919050565b600080600080600060a086880312156101cf57600080fd5b6101d88661019b565b945060208601359350604086013592506101f46060870161019b565b94979396509194608001359291505056fea2646970667358221220ea2fe53af507453c64dd7c1db05549fa47a298dfb825d6d11e1689856135f16764736f6c63430008110033",
}
```

**assembly 구조**
```
# Asssembly 구조
// Memory Layout:
// ----
// 0x00   0xff                           (1 byte)
// 0x01   registry (address)             (20 bytes)
// 0x15   salt (bytes32)                 (32 bytes)
// 0x35   Bytecode Hash (bytes32)        (32 bytes)
// ----
// 0x55   ERC-1167 Constructor + Header  (20 bytes)
// 0x69   implementation (address)       (20 bytes)
// 0x5D   ERC-1167 Footer                (15 bytes)
// 0x8C   salt (uint256)                 (32 bytes)
// 0xAC   chainId (uint256)              (32 bytes)
// 0xCC   tokenContract (address)        (32 bytes)
// 0xEC   tokenId (uint256)              (32 bytes)

// Silence unused variable warnings
pop(chainId)

// Copy bytecode + constant data to memory
calldatacopy(0x8c, 0x24, 0x80) // salt, chainId, tokenContract, tokenId
mstore(0x6c, 0x5af43d82803e903d91602b57fd5bf3) // ERC-1167 footer
mstore(0x5d, implementation) // implementation
mstore(0x49, 0x3d60ad80600a3d3981f3363d3d373d3d3d363d73) // ERC-1167 constructor + header

// Copy create2 computation data to memory
mstore8(0x00, 0xff) // 0xFF
mstore(0x35, keccak256(0x55, 0xb7)) // keccak256(bytecode)
mstore(0x01, shl(96, address())) // registry address
mstore(0x15, salt) // salt

// Compute account address
let computed := keccak256(0x00, 0x55)

// If the account has not yet been deployed
if iszero(extcodesize(computed)) {
    // Deploy account contract
    let deployed := create2(0, 0x55, 0xb7, salt)

    // Revert if the deployment fails
    if iszero(deployed) {
        mstore(0x00, 0x20188a59) // `AccountCreationFailed()`
        revert(0x1c, 0x04)
    }

    // Store account address in memory before salt and chainId
    mstore(0x6c, deployed)

    // Emit the ERC6551AccountCreated event
    log4(
        0x6c,
        0x60,
        // `ERC6551AccountCreated(address,address,bytes32,uint256,address,uint256)`
        0x79f19b3655ee38b1ce526556b7731a20c8f218fbda4a3990b6cc4172fdf88722,
        implementation,
        tokenContract,
        tokenId
    )

    // Return the account address
    return(0x6c, 0x20)
}

// Otherwise, return the computed account address
mstore(0x00, shr(96, shl(96, computed)))
return(0x00, 0x20)

```
---
- 일단 깃헙 커밋 메시지는 대문자로 하기
---
- PR은 Motivation과 Solution으로 나누어 기술하기 
  - 참고: https://github.com/erc6900/reference-implementation/pull/52
---
- 코드
```
(address signer, ECDSA.RecoverError err) =
    userOpHash.toEthSignedMessageHash().tryRecover(userOp.signature);
if (err != ECDSA.RecoverError.NoError) {
    revert InvalidSignature();
}
```
---
- sol 파일 함수 설명
```
/// @title Base Session Key Plugin
/// @author Decipher ERC-6900 Team
/// @notice This plugin allows some designated EOA or smart contract to temporarily
/// own a modular account.
/// This base session key plugin acts as a 'parent plugin' for all specific session
/// keys. Using dependency, this plugin can be thought as a proxy contract that stores
/// session key duration information, but with validation functions for session keys.
///
/// It allows for session key owners to access MSCA both through user operation and 
/// runtime, with its own validation functions.
```

```
/// @notice Route call to executeFromPluginExternal at the MSCA.
    /// @dev This function will call with value = 0, since sending ether 
    /// for ERC20 contract is not a normal case.
    /// @param target The target address to execute the call on.
    /// @param data The call data to execute.
```


요것도 괜찮네: 
https://github.com/erc6900/reference-implementation/pull/22/commits/0fb2113a0f1b09e8eeef72dd6d04b04bbc0151a8
```
​​    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

```
/// @inheritdoc ISessionKeyPlugin
function addTemporaryOwner(address tempOwner, uint48 _after, uint48 _until) external {
```

### PR에 설명 달기
```
## Motivation
We would like to accumulate the money for Poohnet Fund which will be used to support the real world projects which have content to make our world friendly.

## Solution
commit 789c3cf6c : Change the code for generating inflation for Poohnet Fund
commit c595c22a9 : Apply configuration for make the inflation start
```

---
### supportsInterface
```
function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
    return interfaceId == type(ISessionKeyPlugin).interfaceId || super.supportsInterface(interfaceId);
}
```
---
### storage modifier
EnumerableSet.Bytes32Set storage sessionKeySet = _sessionKeySet[msg.sender];
Purpose: This line declares a variable sessionKeySet that refers to a set of session keys for the message sender (msg.sender). The storage modifier indicates that sessionKeySet is a pointer to the data located in the contract's persistent storage, not a temporary copy. This is crucial in Solidity because changes to a storage variable directly modify the state on the blockchain.

---
### unchecked block
The unchecked block is used here to tell the compiler not to check for overflows when incrementing the index i. This can save gas since the overflow is unlikely given the controlled environment of the loop (i.e., looping over an array length

---
### transient storage sample
https://solidity-by-example.org/transient-storage/

---
forge create

forge script script/DeployTransactionDelegator.s.sol --rpc-url $LOCALNET_RPC_URL

---
### CREATE a CONTRACT with 2 SAME addresses on 2 DIFFERENT chains

address = bytes20(keccak256(0xFF, senderAddress, salt, bytecode))

How to deploy my contract on 2 different chains with the same address?
Now, let’s answer to the question: How to deploy a smart contract with the same addresses in 2 different chains?

You can do it with the CREATE2 opcode by providing the same salt on different chains. (easier than providing the nonce because you can’t fully control it)

[here](https://trustchain.medium.com/create-a-contract-with-2-same-addresses-on-2-different-chains-3ed987b1e348)

---
foundry remapping은 toml에서 지정함.

tokenURI 함수, ERC721

forge init –force 
forge install https://github.com/OpenZeppelin/openzeppelin-contracts@v4.9.3

---
### Fatal: Failed to write genesis block: database contains incompatible genesis

==> 원래 genesis_testnet.json과 genesis_fund_testnet의 아래 부분이 다름
```
"difficulty": "1",
  "gasLimit": "8000000",
  "extradata": "0x00000000000000000000000000000000000000000000000000000000000000008532654aD638Db3deE3836B22B35f7Ca707428ca0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "alloc": {
    // 중략
  }
}
```

### OnlyHardhatNetworkError: This helper can only be used with Hardhat Network. You are connected to 'localnet', whose identifier is 'Geth/v1.12.1-unstable-5e198bde-20240602/darwin-amd64/go1.21.3'
      at checkIfDevelopmentNetwork (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-network-helpers/src/utils.ts:29:11)
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async getHardhatProvider (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-network-helpers/src/utils.ts:40:3)
      at async Object.latest (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-network-helpers/src/helpers/time/latest.ts:7:20)
      at async deployOneYearLockFixture (/Users/hyunjaelee/work/web/ex/test/basic.spec.localnet.ts:24:25)
      at async loadFixture (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-network-helpers/src/loadFixture.ts:59:18)
      at async Context.<anonymous> (/Users/hyunjaelee/work/web/ex/test/basic.spec.localnet.ts:37:36)

#### info
- 2023.06.07 Fri 
- test code를 로컬넷에서 실행시키니까 문제가 발생함. 
- web3_clientVersion 관련 있음.
```
version.toLowerCase().startsWith("hardhatnetwork") ||
version.toLowerCase().startsWith("anvil");
```
- 내 geth code의 web3_clientVersion 코드를 바꿔야 가능함.
- anvill 코드 보면 금방 바꿀 수 있을 것으로 보임.

### TypeError: Cannot read properties of undefined (reading 'provider')
    at Object.<anonymous> (/Users/hyunjaelee/work/web/ex/test/create2/base.spec.ts:5:25)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Module.m._compile (/Users/hyunjaelee/work/web/ex/node_modules/ts-node/src/index.ts:1618:23)
    at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Object.require.extensions.<computed> [as .ts] (/Users/hyunjaelee/work/web/ex/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Function.Module._load (node:internal/modules/cjs/loader:1019:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:177:18)
    at /Users/hyunjaelee/work/web/ex/node_modules/mocha/lib/mocha.js:414:36
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.

#### hardhat.config.ts에 아래 추가
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-etherscan'


#### TypeError: Cannot read properties of undefined (reading 'provider'): 
```
이런 에러가 떨어지는 이유가 아래 import 문 때문인데, 
import { ethers } from “hardhat”
hardhat의 ethers 버전은 내가 쓰려는 버전보다 낮아서 그런 것이다. 아래와 같이 바꾸면 됨. 
import { ethers } from "ethers";
hardhat의 ethers 버전과 나의 ethers 버전이 다르면 또 문제가 생김. 
```
```
const provider = ethers.provider;
signer = await ethers.getSigner();
위에서 발생하는 “TypeError: Cannot read properties of undefined (reading 'provider')” 문제는 모두  아래와 연관이 있는 것이고,
ethers: typeof ethers & HardhatEthersHelpers;
이것은 hardhat.config.ts에 import "@nomicfoundation/hardhat-toolbox"; 추가해야 함.
결국 provider와 getSigner는 hardhat.config.ts와 관련된 것이었음.
```

#### TypeError: Cannot read properties of undefined (reading 'waitForTransaction')
```
await expect(execAccount.executeUserOp(userOp, 1)).to.emit(execAccount, "Executed").withArgs("Got it!", hashedMessage);
     TypeError: Cannot read properties of undefined (reading 'waitForTransaction')
      at waitForPendingTransaction (node_modules/@nomicfoundation/hardhat-chai-matchers/src/internal/emit.ts:34:19)
      at /Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-chai-matchers/src/internal/emit.ts:84:21
```
- @nomicfoundation/hardhat-chai-matchers 버전을 ^1.0.6 -> ^2.0.7 올림
- 과연 서로 다른 패키지를 하위에 포함시킬때 어떻게 되는지 확인하기: 각자의 패지키를 사용하는데, Peer-dependency를 강제하는 경우도 있지.
   

#### "ethers": "^6.1.0", <== 알아서 설치됨


#### TypeError: (0 , ethers_1.getAddress) is not a function
hardhat의 ethers를 쓸때 이런일이 발생함으로 6.7.0을 써야함. 그렇다면 hardhat은 내 ethers를 쓴다는 얘기? 내꺼 쓰는게 맞음. 그러면 뭐하러 import { ethers } from "hardhat"; 이걸쓰냐구??? 어쨌든 hardhat의 node_modules에는 hardhat 깔리게 없음. 




### forge install 할때, .gitmodules가 필요함

forge init –force

forge install OpenZeppelin/openzeppelin-contracts

forge test --match-contract PoohnetFund

forge test --match-contract PoohnetFund --fork-url $LOCALNET_RPC_URL

forge test --match-path test/forge/FulfillBasicOrderTest.sol --gas-report


### source code
import "@openzeppelin/contracts/utils/Create2.sol";

```
address fundContractAddr = vm.envAddress(
  "POOHNET_FUND_CONTRACT_ADDRESS"
);
```

### command


console.log(`balance of deployer: ${await provider.getBalance(deployer.address)}`);
console.log(`Receipt: ${JSON.stringify(receipt)}`);
const tx = await deployerListSetStore.addValue(valueData);

CONTRACT="AllBasic" yarn contract --network localnet

function _getListValue(uint240 value) internal pure returns (SetValue) {
   return SetValue.wrap(bytes30(value));
 }

byte(0, mload(add(sig, 96))) extracts the first byte of this 32-byte value, because 0 is the index for the first byte.

// Clear any dirty upper bits of address 상위비트가 지워짐을 주의 
addr := and(addr, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)

https://github.com/ethereum/solidity/releases

expect(receipt?.status).to.equal(1); **이렇게 해야 빨간줄이 안생김**

slot := keccak256(keyBuffer, 0x80) // Solidity keccack256과는 좀 다름.

**function executeUserOp 리턴값을 체크하지 못하던 문제** 
In view and pure functions, which are called statically from a local node without a transaction. Or when doing such a static call to any function, but knowing that the state changes are not persisted.


**두개의 차이 ==> 첫번재것 설명**: This expression generally means you are waiting for the `expect` function (a promise) to resolve. This is typically used with assertion libraries like Chai when you are expecting a promise to be rejected or resolved in a certain way.
```
await expect(execAccount.executeUserOp(userOp, 1)).to.emit(execAccount, "Executed").withArgs("Got it!", hashedMessage);
expect(await execAccount.executeUserOp(userOp, 1)).to.emit(execAccount, "Executed").withArgs("Got it!", hashedMessage);
```

#### contract size
- limit:  **24,576 bytes** (24 KB).
- 빈 함수 하나 추가하면 23바이트 추가됨 ==> function addNone() public {}
- 플러스 연산하는 코드 하나 추가하면 26바이트 추가됨 ==> value2 += 62;
- Warning: 3 contracts exceed the size limit for mainnet deployment (24.000 KiB deployed, 48.000 KiB init).

```
const contractCode = await provider.getCode(tooBig.address);
const contractSize = (contractCode.length - 2) / 2; // Subtract 2 for '0x' prefix and divide by 2 to get the byte count
```

아래의 isPrime처리 코드를 library call 하는 것으로 바꾸면 200bytes 차이, 그냥 없애면 500바이트 차이.
```
 function addSixtyTwo(uint256 n) public returns (bool) {
    // return n.isPrime();
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (uint256 i = 5; i * i <= n; i += 6) {
      if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
  }
```

---
solc --bin --abi contracts/assembly/DataStorage.sol -o output

---
// Call transfer function and check for success/failure
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

---
yarn init -y
yarn add typescript ts-node @types/node --dev
tsc --init


---
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try brew install
xyz, where xyz is the package you are trying to
install.

==> python3 -m pip config set global.break-system-packages true


---
ModuleNotFoundError: No module named 'web3'
python3 -m pip --version

python3 -m pip install web3

---
curl v4.ident.me

# # 3. Dev

## Projects Summary
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐹🐶🦄☕️🚘※
### Project Analysis
##### 문서 확인: 2일
1. 홈페이지에서  기본정보 습득 (예: centrifuge.io)
  - 개발자 문서 및 github 사이트 찾기
  - 홈페이지에 기본적인 정보 다 있음.
  - 개괄적인 정보를 위해서 **구글링해서 찾아보기**
3. 홈페이지에서 찾은 doc 문서 보기
4. github repo 찾아서 기본 보기
5. discord 들어가보기
6. 진행 상황을 구글 Docs에 정리
  - 필요하면 다이어리도 활용
  - 코드에 대해서는 Miro에 정리

##### 테스트 코드 분석: 3일
1. 환경설정
  - 필요한 서버 및 구성 확인
2. 테스트 코드 실행
### poohnet testnet admin
58984b2bf6f0f3de4f38290ed3c541ac27bac384b378073ab133af8b314a1887

0x1811DfdE14b2e9aBAF948079E8962d200E71aCFD

### keyless2
- hardhat-deploy
- .env.sample

---
### zksync
local-setup에서 clear-sql.sh와 start-sql.sh
localentry.sh 실행
greeter-example에서 deploy-test와 greet-test진행



🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹
🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹
🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹
🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹🐹

--------
## Blockchain
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※
### hardhat localnet 실행하기

```
yarn hardhat node (chain id: 31337)
yarn hardhat run ./scripts/send-raw-tx.ts --network hardhat
```

Ethereum mainnet fork된 로컬 네트워크를 실행
```
yarn hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/<key>
```

### ganache localnet 실행하기
```
npm install -g ganache-cli
ganache-cli
```

gaslimit을 주고 싶을때
```
ganache-cli -l 7900000
```
---
### clique in genesis.json
```json
{
  "config": {
    "chainId": 12301,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "arrowglacierBlock": 0,
    "clique": {
      "period": 1,
      "epoch": 30000
    }
  },
  ...
}
```
- "period":
This refers to the block time, the time interval between consecutive blocks. In this case, 1 means one second. This is a very fast block time, suitable for private or test networks where quick consensus is desired. In public networks, such short intervals could lead to network instability due to propagation delays and increased likelihood of forks.

- "epoch":
The epoch length, set here as 30000, is significant in Clique PoA. An epoch is a period after which the list of authorized signers can be updated. In Clique, every epoch blocks, a special block called the epoch transition block is generated, which contains the list of authorized signers for the next epoch. The number 30000 means that every 30,000 blocks, the network has an opportunity to update the list of signers.

---
### BOA 유통량 API
- 유통량: https://api.bosplatformfoundation.io/boa_circulating_supply
- 총발행량: https://api.bosplatformfoundation.io/boa_supply

---
### 이더리엄 Endpoint
- Alchemy 사용 (https://dashboard.alchemy.com/)


## Hardhat


### Hardhat / solidity
Hardhat은 기존 프로젝트에서는 안됨.
```
yarn init -y (=npm init -y)
yarn add --dev hardhat
npx hardhat

yarn add -D hardhat-deploy
yarn add -D dotenv
```

아래 두개는 같이 쓰면 안됨.
```
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle"; // 이것만써.
```
기타
```
yarn add @openzeppelin/contracts
```

--------
😈 solidiy
import "hardhat/console.sol";
npx hardhat compile

const tx = await factoryInstance.setFeeTo(process.env.FEE_TO);
const receipt = await (await tx).wait();


--- 

### Hardhat / Foundry
[Integrating with Foundry](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-and-foundry)

If you have an existing Hardhat project and you want to use Foundry in it, you should follow these steps.

First, run `forge --version` to make sure that you have Foundry installed. If you don't, go `here` to get it.

After that, install the `@nomicfoundation/hardhat-foundry` plugin:

```
npm install --save-dev @nomicfoundation/hardhat-foundry
```
and import it in your Hardhat config:

```
import "@nomicfoundation/hardhat-foundry";
```
To complete the setup, run `npx hardhat init-foundry`. This task will create a `foundry.toml` file with the right configuration and install `forge-std`.

submodule이 아래와 같이 추가됨
```
[submodule "ex2/lib/forge-std"]
  path = ex2/lib/forge-std
  url = https://github.com/foundry-rs/forge-std
```

### Workspaces
- [hardhat-zksync](https://github.com/poohgithub/hardhat-zksync/tree/main) 참고


## Foundry
### Install Foundry
```
mkdir foundry
cd foundry
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc 
foundryup
```

### Initializing a new Foundry Project
```
forge init .
```

## Dev Settings
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### Node workspaces
😈 Structure and Configuration
- Workspace Root: A single workspace has a root directory, usually with a package.json file that includes a workspaces field.
- Sub-packages: Inside the root, there are subdirectories for each workspace, each with its own package.json file.
- Shared Configuration: Dependencies and scripts can be shared across workspaces, which is especially useful for common configurations and shared libraries.

😈 Reference Project
- [poohgithub zksync-era](https://github.com/poohgithub/zksync-era)
- [mater-labs pymaster-examples](https://github.com/matter-labs/paymaster-examples)

---
### TypsScript/Nodejs

😈 NodeJs 프로젝트
- npm init -y
- touch index.js

😈 TypeScript 프로젝트
- npm install -g typescript (or yarn global add typescript)
- npm init -y
- npx tsc --init
- package.json --> CoPilot이 다 해줌
 "build": "tsc",
  "start": "node dist/index.js"
- tsconfig.json
  "outDir": "./dist",
  "include": ["./scripts", "./test", "./typechain"],
  "files": ["./hardhat.config.ts"]
- mkdir src
- touch src/index.ts
- yarn build
- yarn start

😈 yarn
yarn add --dev 


### Docker

😈 Docker Image 만들기
1. https://github.com/poohgithub/poohgeth/blob/master/Dockerfile 참고
2. docker build -t linked0/poohgeth:v1.3 . // 끝의 dot(.) 주의
3. docker 실행 (optional)
```
docker run -p 3000:3000 linked0/poohgeth:v1.3
```
1. docker login
2. tag: 기존 v1.0 태그 말고, latest를 붙이고 싶을때.
```
   docker tag linked0/poohgeth:v1.0 linked0/poohgeth:latest
```
3. push
```
   docker push linked0/poohgeth:v1.3
```
4. pull 
```
   docker pull linked0/poohgeth:v1.3
```
5. run using docker-compose
```
https://github.com/poohgithub/poohgeth/blob/master/poohnet/docker-compose-node.yml 참조
docker compose -f docker-compose-node.yml up el1 -d
```

😈 Docker 이슈
- `docker build`시 오랫동안 멈춰있을 때, prune후에 재부팅해보기.
```
 docker container prune
``` 

😈 기타
- docker attach

- docker ps | grep 5432

- 파일의 권한도 github으로 등록된다. run_node 실행권한

- To restore the entire staging area to the HEAD commit, you can run the following command:
git restore --staged .

- 수호는 블록체인 생태계를 활성화하고 연결하기 위하여 Bridge, DEX와 같은 Dapp 프로덕트를 개발하고 있습니다.

---
### NPM
npm login
npm publish --access public

---
### Python
😈 venv 설정하고 간단한 프로그램 실행
python -m venv venv
source venv/bin/activate
code script.py

```
def hello_world():
    print("Hello World")

if __name__ == "__main__":
    hello_world()
```

python script.py

pip install requests
pip freeze > requirements.txt
pip install -r requirements.txt

다 끝나면 deactivate

😈 머신에 설치하기 
pip3 install -r requirements.txt
python3 setup.py install

```
from setuptools import find_packages, setup
setup(
    name="staking_deposit",
    version='2.5.2',
    py_modules=["staking_deposit"],
    packages=find_packages(exclude=('tests', 'docs')),
    python_requires=">=3.8,<4",
)
```
설치하면 아래의 위치에 설치됨
```
/Library/Python/3.9/site-packages/staking_deposit-2.5.4-py3.9.egg
```
설치 하고 나면 아래 쉘스크립트 실행 가능
https://github.com/poohgithub/poohprysm/blob/develop/poohnet/pooh-deposit-cli/deposit.sh

😈 colab
import matplotlib.pyplot as plt

😈 VS Code
- Open the Command Palette (⇧⌘P), start typing the Python: Create Environment
- 다른 프로젝트(예: poohcode)의 하위 프로젝트라면 .venv 폴더 복사
- source ./venv/bin/activate
- 수동으로 하는 방법: python3 -m venv venv39
- pip3 freeze > requirements.txt <== venv를 빠져나오고 해야함.
- python hello.py

---
### Rust
Homebrew rust와 rustup로 설치된 것과 연동안됨. 따라서 아래와 같이 지우기
brew uninstall rust

그리고 rustc 이용
rustup install nightly-2023-07-21
rustup default nightly-2023-07-21

---
## Prettier/Lint 적용
1. VS Code의 settings: 이것을 하면 파일이 저장될때 자동적으로 적용됨.
- typescript.format: enable/disable
- solidity.formatter: none/prettier/forge

2. prettier, eslint, solhint
- .prettierrc.js, .eslintrc.js(.eslintignore.js), .solhint.json(config 폴더에 있을 수 있음.)
```
"prettier": "node_modules/.bin/prettier --write --config .prettierrc 'contracts/**/*.sol' 'test/**/*.ts' 'utils/**/*.ts' 'scripts/**/*.ts'",
```
혹은
```
"lint:check": "yarn lint:check:format && yarn lint:check:solhint && yarn lint:check:eslint",
"lint:check:format": "prettier --check **.{sol,js,ts}",
"lint:check:solhint": "yarn build && solhint --config ./config/.solhint.json --ignore-path ./config/.solhintignore contracts/**/*.sol",
"lint:check:eslint": "eslint . --ext js,ts",
```
3. husky에서 다음 사용 가능
```
"husky": {
   "hooks": {
     "pre-commit": "lint-staged",
     "commit-msg": "npx --no -- commitlint --edit ${1}"
   }
 },
  "lint-staged": {
    "*.sol": "prettier --write",
    "*.js": "prettier --write",
    "*.ts": "prettier --write"
  }
```
-------
## Github
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### fast-forward 문제
- push 하려고 할때 아래와 같은 문제 발생 --> github remote의 브랜치가 더 최신버전일때 발생
- 이것을 가장 최신의 확실한 방법임. 그냥 rebase 해주면 됨
```
git rebase origin master
```

- 이것 에전 설명인데, 일단 그냥 참고용으로 그냥둠
```
$ account-abstraction git:(test-flow) ✗ git push -f
To github.com:linked0/account-abstraction
 ! [rejected]        test-flow -> test-flow (non-fast-forward)
error: failed to push some refs to 'github.com:linked0/account-abstraction'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```
- 이럴 경우는 다음의 단계를 거침
  - git fetch origin
  - git reset --hard HEAD~1 
  - git rebase origin/pooh-version
  - git reflog : 추가로 푸시하려고 했던 커밋을 찾아내기
  - git cherry-pick <커밋아이디> : 추가하려고 했던 커밋 아이디를 체리픽
- 상세 설명
  - 현재 리모트 기준으로 HEAD + 1 까지 진행된 상태에서, 로컬의 HEAD와 리모트의 HEAD가 불일치된 상태
  - 그런데, 그 불일치 상태에서 추가적인 commit이 진행된 상태에서 push를 하려고 해서 문제 발생
  - 따라서, HEAD~1까지 되돌린후에 리모트의 HEAD를 적용한 후에,
  - 현재의 commit을 적용해야하는 것임

---
### 로컬의 커밋을 날려먹었을때
`git reflog`를 사용하면 커밋 아이디를 확인할수 있음
`git cherry-pick`를 이용하여 가져오면 됨.
```
$ git reflog
8fd79d7 (HEAD -> pooh-version, origin/pooh-version) HEAD@{0}: cherry-pick: fixup;
bc5852b HEAD@{1}: rebase (finish): returning to refs/heads/pooh-version
bc5852b HEAD@{2}: rebase (start): checkout origin/pooh-version
28fbb3b (origin/main, origin/HEAD, main) HEAD@{3}: reset: moving to HEAD~1
bc5852b HEAD@{4}: reset: moving to HEAD
bc5852b HEAD@{5}: reset: moving to HEAD
bc5852b HEAD@{6}: reset: moving to origin/pooh-version
28fbb3b (origin/main, origin/HEAD, main) HEAD@{7}: reset: moving to HEAD
28fbb3b (origin/main, origin/HEAD, main) HEAD@{8}: reset: moving to HEAD~2
37017b9 HEAD@{9}: rebase (finish): returning to refs/heads/pooh-version
37017b9 HEAD@{10}: rebase (reword): fixup
b3d7c55 HEAD@{11}: rebase: fast-forward
6443037 HEAD@{12}: rebase (start): checkout HEAD~2
b3d7c55 HEAD@{13}: commit: fixup;
6443037 HEAD@{14}: reset: moving to HEAD
6443037 HEAD@{15}: reset: moving to HEAD~1
2d482e7 HEAD@{16}: cherry-pick: fixup
6443037 HEAD@{17}: reset: moving to HEAD~1
dd83300 HEAD@{18}: reset: moving to HEAD
dd83300 HEAD@{19}: commit: fixup
6443037 HEAD@{20}: reset: moving to HEAD
```
---
### github 계정 꼬였을때
ERROR: Permission to poohgithub/poohnet-pow.git denied to jay-hyunjaelee.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.

- ~/.gitconfig에 emial 설정 에서 equal sign 양 옆의 스페이스 없애기
- 재부팅하기 

---
### error: cannot run delta: No such file or directory
- git lg 실행시 발생
- brew install git-delta.

---
### git submodule update 에러 발생시 
```
git rm --cached path_to_submodule
Edit .gitmodules File
Edit .git/config File
rm -rf .git/modules/path_to_submodule
git commit -am "Removed submodule"
git push
```

---
### 내가 올린 브랜치에 대해서 자동으로 PR추천을 할수 있도록 하기.
- Organization의 해당 리파지토리로 이동
- Settings -> General 이동
- Always suggest updating pull request branches 를

--- 
### Merge pull request 발생하지 않도록 Full Requests 설정
- Repository Setting -> Pull Requests
  - Uncheck: "Allow merge commits", "Allow squash merging" 

---
### 기타 정리
- git reset --hard michael/add-npm-script-prettier
	git remote update 한번 해줘야 함.
	해당 브랜치로 들어가서 최신 버전으로 갱신하기 
- git pull <remote> <remote branch>
	로컬의 수정을 반영하기
	ex) git pull zero commons-budget-contract
- git rebase 도중 파일 제거하기
	git rm --cached <file>  
- git rebase 도중 stage된 파일 리셋하기
	git reset HEAD~1 -- package.json
- revert
	※ This will create three separate revert commits:
		§ git revert a867b4af 25eee4ca 0766c053
	※ It also takes ranges. This will revert the last two commits:
		§ git revert HEAD~2..HEAD
	※ Similarly, you can revert a range of commits using commit hashes (non inclusive of first hash):
		§ git revert 0d1d7fc..a867b4a
- git clone시 폴더명 지정
	git clone git@github.com:whatever folder-name
- Fatal: Not possible to fast-forward, aborting
	git pull --rebase.

- git diff --name-only HEAD~1 HEAD~2
- git log with graph
git log --graph --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%an%C(reset)%C(bold yellow)%d%C(reset) %C(dim white)- %s%C(reset)' --all

😈 private repo clone
- $ key-gen
- $ eval "$(ssh-agent -s)"
- $ ss-add .ssh/id_rsa_graph_node
- id_rsa_graph_node.pub를 cat해서 리파지토리 Setting -> Deploy keys에 추가
- git clone git@github.com:bosagora/boa-space-graph-node.git
    
😈 Organization만들고, 포크하기 (fork)
poohgithub organization에서 Setting->Members privileges->Allow forking of private repositories.

-------
## Mac
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### MacVim을 Spotlight에서 보도록 하기
For those with Yosemite and MacVim from homebrew not showing up in Spotlight, using an alias works.

(Be sure to delete any MacVim that is already in /Applications.)

From the Terminal:

Uninstall existing: brew uninstall macvim
Install latest: brew install macvim
Open directory in Finder. Ex: open /usr/local/Cellar/macvim/7.3-64
In Finder, right-click on the MacVim.app icon and select "Make Alias".
Copy the alias you just created to the /Applications folder.
Spotlight will index the MacVim alias.

Source: https://github.com/Homebrew/homebrew/issues/8970#issuecomment-4262695

---
### Mac Spotlight에서 특정 애플리케이션 찾지 못할 때
First, turn off Spotlight:
sudo mdutil -a -i off

Next, unload the metadata file that controls Spotlight's index:
sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist
여기서 에러날 수 있음 그냥 무시하고 다음으로 넘어감.

The following command re-loads the index:
sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist

Finally, turn Spotlight back on:
sudo mdutil -a -i on

---
### Mac에서 Sublime Text를 커맨트창에서 실행시키기
```
ln -s "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" /usr/local/bin/subl
```

-------
## vi
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

### 줄번호
```
:set number
:set nu
```

없애기는 아래와 같이
```
:set number!
:set nu!
```

### files 파일 만들기
find . -type f -not -path .*/node_modules/* -not -path .*/.git/* -not -path .*/venv/* > files

find ./ -type f > files
find . -type file -name '*.js' -o -name '*.json' > files  //-o는 or를 뜻함
find . -type f -not -path './node_modules/*' -not -path './chaindata/*' > files

open file: ctrl w, ctrl f

---
### basics

g t: Next tab, 그냥 에디터에서 g와 t를 치면 됨
g T: Prior tab
nnn g t: Numbered tab, nnn은 숫자를 나타냄, 1일수도 있고, 12일수도 있음.

"*yy           ; copt from vi 
:! wc          ; sh command in vi

:shell 혹은 :sh를 이용해서 shell(:12)로 빠져나갈 수 있다. exit 혹은 Ctrl+D를 이용해서 vim으로 되돌아올 수 있다.
:! # 마지막 커맨드의 결과보기 

mvim --remote-tab-silent search.go  // 같은 윈도우에서 열기

---
### Move cursor to end of file in vim
```
:$
```

---
### 한글 깨지는 문제
set enc=utf-8

---
### vimrc (~/.vimrc)
set nocompatible
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/Vundle.vim' "required
Plugin 'tpope/vim-fugitive' "required 
call vundle#end()
filetype plugin indent on " Put your non-Plugin stuff after this line
:w
:source %
:PluginInstall
syntax enable " syntax highlighting
set nu " add line numbers
set smartindent " make smart indent
set tabstop=4 " tab width as 4 (default 8)
set shiftwidth=4
set softtabstop=4       ; TAB키를 눌렀을때 몇 칸을 이동?
set tabstop=4           ; 하나의 TAB을 몇 칸으로 인식? 
set number		            ;  Line Number
set expandtab " spaces for tab
set incsearch
set mouse=a

-------

## #aws
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

---
### AWS 가격표
참고: https://aws.amazon.com/ec2/pricing/on-demand/

| name      | hourly | vCPU | Memory | Storage | Network performance |
| --------- | ------ | ---- | ------ | ------- | ------------------- |
| t3.small  | $0.026 | 2    | 2 GiB  | EBS     | Up to 5 Gigabit     |
| t3.medium | $0.052 | 2    | 4 GiB  | EBS     | Up to 5 Gigabit     |
| t3.large  | $0.104 | 2    | 8 GiB  | EBS     | Up to 5 Gigabit     |

---
### AWS에 Load Balancer 추가시 
• Certifacate Manager를 통해서 도메인 추가
	- "Create records in Route 53" 해줘야 함.

---
### node3에 들어가서 postgresql 도커 접속방법
sudo docker exec -it ec22f5036e09 bash
psql -d db -U postgres -W

---
### WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
Add correct host key in /Users/hyunjaelee/.ssh/known_hosts to get rid of this message.

---
### public key 확인 및 깃헙에 추가하기
- `cat .ssh/id_rsa_linked0.pub`
- 계정의 세팅으로 들어가면 `SSH and GPG keys`에 집어넣으면 됨.
- git clone할 때 sudo를 넣어야 `Load key … : Permission denied` 에러가 발생하지 않음.
- `git clone https://github.com/linked0/agora.git` 이건 잘되는 ssh로 받을때 안됨

---
### 접속
```
ssh -i "pooh-seoul.pem" ubuntu@ec2-52-79-227-164.ap-northeast-2.compute.amazonaws.com
```
---
### AWS에서 파일 전송 
* 가져오기
```
scp -i ~/pooh/pooh-seoul.pem ubuntu@ec2-52-78-204-156.ap-northeast-2.compute.amazonaws.com:~/share/test.txt .
```
* 보내기
```
scp -i ~/pooh/pooh-seoul.pem test.txt ubuntu@ec2-52-78-204-156.ap-northeast-2.compute.amazonaws.com:~/share/test.txt
```
---
### Load Balancer 
- Mappings는 모든 존으로
- Security Group은 AgoraDevNet_ELB
- 리스너 지정: Target Group지정
- 나중에 80에 대해서 443으로 Redirect
---
### URL로 접근이 안되는 문제
- 실패상황황인데, CNAME과 A 설정만 맞으면 될 것 같음 (230303)
---
### Target Group
- Basic configuration: Instances
- Protocol/Port 지정
- Protocol version: HTTP1
- Health checks는 그대로 두면 됨.
---
### AWS 타임존 변경
```shell
$tzselect
```
.profile에 다음을 추가하고 재로그인
```
TZ='Asia/Seoul'; export TZ
```


# #4. Freqeunt Use

## 자주 쓰는 것 - Part1
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸

### Slack

😈 github subscribe
```
/github subscribe  bosagora/boa-space-contracts issues pulls commits releases deployments reviews comments
```

```
/github subscribe zeroone-boa/validators reviews comments
```
이것도 방법, 위의 것과 비교 필요: 
```
/github subscribe bosagora/boa-space-seaport-js issues pulls commits releases deployments reviews comments
```

### Memo Google Docs
- bit.ly/44TH7Ua : Memo Pub
- bit.ly/357Is0p : Memo

### 예상치 못한 컴파일 에러가 나올때
- brew update && brew upgrade

### Generate Private Key
openssl ecparam -name secp256k1 -genkey -noout

### Mac XCode
brew install macvim --override-system-vim

https://developer.apple.com/download/more/?=command%20line%20tools 에서 다운로드 필요
xcode-select install
sudo xcode-select --switch /Library/Developer/CommandLineTools

### source를 다른 위치에 new_source라는 이름으로 복사(두가지 방법)
cp -a source ~/temp/new_source

find . -iname mainview*
touch -t "201610041200" timestamp
find . -type f -newer timestamp

sudo xcode-select -s /Applications/XCode7.2/Xcode.app/
To clear the terminal manually: Cmd + K
ps aux | grep chrome

### 🌸 Google docs
* Indentation 수정
Format - Align & Indent - Indentation Option에서 Hanging 수정하면 됨

### 🌸 poohnet (EL/CL) 실행하기
😈 geth compile
```
brew install golang
go run build/ci.go install -static ./cmd/geth or make geth
sudo cp ./build/bin/geth /usr/local/bin/geth
```
😈 EL
- ./init 치면 help 나옴
- ./enode 치면 help 나옴

😈 CL
1. 블럭해시과 genesis time(date +%s)을 chain-config 반영하고 eth2-testnet-genesis 실행
    - gen_genesis
    - zcli pretty bellatrix  BeaconState genesis.ssz > parsedState.json로 Validators Root 가져오기
    - settings.py에 GENESIS_VALIDATORS_ROOT에 추가, 근데 이건 거의 안 바뀜.
2. staking-deposit-cli로 wallet 만들기
    - sudo ./deposit.sh install, 만약 longinterpr.h 에러 발생하면 아래 실행
        - python3.10 -m venv py310
        - source py310/bin/activate
    - ./deposit.sh existing-mnemonic
3. 첫번째 cnode 실행하고 enr 알아내서 bootstrap-node
    - cl은 el과 연동되므로 init할 필요 없음
    - poohprysm 루트폴더의 cnode로 실행.
4. 나머지 cl 실행시키기
5. keys &validators 실행
    - poohprysm 루트폴더에서 찾아야 함.

😈 
- 그냥 로컬로 실행할때
```
poohgeth/poohnet$ ./enode-config
```

- 간단하게 testnet으로 실행할때
```
poohgeth/poohnet$ ./enode pow el1
```
---
## 자주 쓰는 것 - Part2
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀

### 🌸 Command

**tar**
```
tar --exclude='node_modules' -cvzf bccard.tar.gz bccard
tar -xvzf xxx.tar.gz -C ./data

여러 sub directory에 node_modules를 제거함.
tar --exclude='*/node_modules' --exclude='.git' -cvzf ~/temp/pooh-tools.tar.gz .
```

opt cmd b - Bookmark

ssh-keygen -t rsa

```
brew install golang
`PATH=$PATH:$HOME/go/bin`
```

go install github.com/protolambda/zcli@latest
zcli --help
alias nd1="ssh -i ~/pooh/tednet.pem ubuntu@13.209.149.243"

**하위 동일 폴더 지우기**
```
find . -type d -name 'temp' -exec rm -rf {} +
```
**alias/export 추가**
```
echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bash_profile
echo 'alias cb="curl -L bit.ly/3MT0VRb"' >> ~/.zshrc
```
**hidden files**
```
    Command + Shift + . (period key)
```
**iterm 단축키**
```
Next split: cmd + ]
Split Vetically: cmd + d
Split Horizontally: shft + cmd + d
```
---
### 🌸 Mac
- Finder에서 파일 경로 복사하기 
```
1. Control-click or right-click on the file in Finder.
2. Press the Option (Alt) key.
3. Choose 'Copy [filename] as Pathname'
```
- 테이블의 셀에서 개행
option + enter

---
### 🦋 Colab 🦋
**열기**
- [colab.google](https://colab.google)로 이동
- "Open Colab" 버튼 클릭
- "노트 열기" 팝업에서 Google Drive -> aplay.ipynb 
- 아니면 깃헙 web 리파지토리의 [aploy.ipynb](https://colab.research.google.com/github/linked0/web/blob/master/pooh/aplay.ipynb) <- 여기에 pyplot 코드 있음

**실행**
- MyDrive/colab/data 연결 가능 (코드에 있음)
- MyDrive/colab/data/test.txt를 가지고 처리하는 코드도 있음

---
### 🦋 VSCode I 🦋
- Prettier 세팅
  - .prettierrc.json 파일 생성
    ```
    {
      "tabWidth": 2,
      "printWidth": 80,
      "overrides": [
        {
          "files": "*.sol",
          "options": {
            "printWidth": 80,
            "tabWidth": 2,
            "useTabs": false,
            "singleQuote": false,
            "bracketSpacing": false,
            "explicitTypes": "always"
          }
        }
      ]
    }
    ```
  - settings.json 파일 열어서 아래 세팅(Default 말고 User용 열어야 함)
    ```
    "editor.formatOnSave": true,
    ```

**정규표현식 SEARCH**
```
_IMPLENENTATION_SLOT
_IMPLENENTATION_APPLT
_IMPLENENTATION_APPLE
```
위 리스트에서 첫 두개의 스트링만 찾고 싶을때
```
_[A-Z]*NENTATION_[A-Z]*T
```
---
### 🌸 Block projects
Sepolia: 579fca7e3f10489b83c047f5cc17bec5
Pooh Admin: 0x58984b2bf6f0f3de4f38290ed3c541ac27bac384b378073ab133af8b314a1887
Jay Test: 0x7184281c677db98212c216cf11e47a4e9ec8f4b6932aa5d2d902b943ad501d23

# #
🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓
🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓
### git
- submodule의 HEAD를 알고 싶을때: 
  - git ls-tree HEAD lib/murky
- submodule의 commit hash 변경
  - cd path/to/submodule
  - git checkout <commit-hash>
  - cd ..
  - git add path/to/submodule
  - git commit -m "Update submodule to specific commit hash"
  - git push

### git submodule
😈 git submodule add 
```
git submodule add https://github.com/example/lib.git external/lib
git submodule update --init
```
😈 git submodule update
```
git submodule update --remote
```
😈 하나만 다운로드 할때
```
git submodule update --init --recursive web2 
```

### git submodule remove
```
git rm --cached poohgeth // path는 .gitmodules 파일의 참고
code .gitmodules // poohgeth 항목 제거
git commit -am "Removed submodule"
git push
```

### git submodule commit change
```bash
cd path/to/submodule
git fetch
git checkout <desired-commit-hash>
cd ../../
git add path/to/submodule
git commit -m "Update submodule to new commit <commit-hash>"
git push origin main  # or your respective branch
```

### npm publish
npm login
npm publish

### hardhat & package.json
🌸 hardhat 프로젝트 만들기
Hardhat은 기존 프로젝트에서는 안됨.
```
yarn init -y (=npm init -y)
yarn add --dev hardhat
npx hardhat // 여기서 이미 필요한 package는 추가됨
```

🌸 local dependency
"tigger-swap-sdk": "file:../tigger-swap-sdk", <-- 현재 프로젝트에서 상대경로이므로 `..`

### Screen
- screen -S el1
- screen -ls            // ls
- screen -r 17288       // attach하기. ls에서 나온 숫자만 입력
- ctrl a+d              // exit
- screen -S el1  -X quit
- screen -r -d 17288    // attatch되어 있는 것 detach

### AWS
- 파일 가져오기:
scp -i ~/pooh/pooh-seoul.pem ubuntu@ec2-3-37-37-195.ap-northeast-2.compute.amazonaws.com:~/share/test.txt .

- 파일 보내기:
scp -i ~/pooh/pooh-seoul.pem test.txt ubuntu@ec2-3-37-37-195.ap-northeast-2.compute.amazonaws.com:~/share/test.txt

### 🌸 curl
- Post: 
curl -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -H "Content-Type: application/json" -X POST http://localhost:3000/mint

- Get: 
curl -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -H "Content-type: application/json" -X GET "http://localhost:3000/balanceOf"

### 🥎 hardhat/foundry 🥎
yarn add https://github.com/eth-infinitism/account-abstraction\#v0.6.0
yarn hardhat node (chain id: 31337)


### Add a local dependency for tigger-swap-sdk
In tigger-swap-sdk folder
- `yarn build`
- `yarn link`

In tigger-web using tigger-web folder
- Add a local dependency for tigger-swap-sdk with yarn
  ```
  yarn add -D file:/Users/jay/work/tigger-swap-sdk 
  ```
- `yarn link "tigger-swap-sdk"` 
- `yarn list`

### Docker
- docker exec -it pow-node geth attach http://localhost:8545
- docker logs pow-node // enode 알아낼때 사용할 수 있음
- docker run --name postgresql \
    -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    -d postgres:latest
- docker exec -it poohgeth-1 sh

### 🌸 IDEA
* Update TOC: mouse right click -> insert... -> update TOC
* Goto section: TOC에서 CMD 버튼 누르고 "#..." 항목 누르기
* 모듈 추가: File -> New -> Module from Existing Sources
주의: 검색되서 나온 체크를 그냥 그대로 두고 진행해야함. uncheck하면 안됨.
* Word Wrap: View -> Active Editor -> Use Soft Wraps
* Terminal: ctrl + `
* 줄번호 없애기: Settings/Preferences > navigate to `Editor` > `General` > `Appearance`.

### 🌸 shortcuts
- 듀얼 탭 열기/닫기: shift + cmd +  s
- 탭 포커스 이동: shift + cmd +  e
- 듀얼 탭에 링크 열기: shift + cmd + click

- VSCode: Settings 열기: cmd + ,
- 현재 프로젝트에서 검색: shift + option + f (마우스 오르쪽 버튼으로 한번 클릭후)
- back: ctrl - , forward: shift ctrl -
- ctrl tab: recent files
- open project: cmd shift n & cmd shift /
- Bigger Font: cmd + "+"

- alt + arrow: code, 줄 이동 시키기
- ctrl + k: 나머지 지우기
- cmd + shift + enter: 패널 크게 하기
- 
- 프롬프트 커맨드 수정: ctrl + x, ctrl + e
- vi에서 단어 이동: w or b
- move window between panes: Ctrl+Cmd+→/←

### add submodule
git submodule add https://github.com/linked0/web.git lib/web
git submodule update --remote lib/web

### 🌸 텍스트 검색 - 프로세스 찾기 - zip
```
find ./ -type f > files
find . -type file -name '*.js' -o -name '*.json' > files  //-o는 or를 뜻함
find . -type f -not -path './node_modules/*' -not -path './chaindata/*' > files
CTRL-W f: open in a new window
CTRL-W gf: open in a new tab
CTRL-W {H,J,K,L}: move among windows, or use arrow key
CTRL-W w 창을 순차적으로 이동
CTRL-W t 최상위 창으로 이동
CTRL-W b 최하위 창으로 이동

g t: Next tab, 그냥 에디터에서 g와 t를 치면 됨
g T: Prior tab
nnn g t: Numbered tab, nnn은 숫자를 나타냄, 1일수도 있고, 12일수도 있음.

"*yy           ; copt from vi 
:! wc          ; sh command in vi

set softtabstop=4       ; TAB키를 눌렀을때 몇 칸을 이동?
set tabstop=4           ; 하나의 TAB을 몇 칸으로 인식? 
set number		            ;  Line Number
set mouse=a             ; Adjust area with mouse

:shell 혹은 :sh를 이용해서 shell(:12)로 빠져나갈 수 있다. exit 혹은 Ctrl+D를 이용해서 vim으로 되돌아올 수 있다.
:! # 마지막 커맨드의 결과보기 

mvim --remote-tab-silent search.go  // 같은 윈도우에서 열기
// Move cursor to end of file in vim
:$
```

--- 
- Quick Open: Cmd + P // 이미 열려있는 tab에서 찾기
- Open Quick Chat: Cmd+Shift+I 
- cmd w : close file in VS Code
- moveEditorToNextGroup: "ctrl+cmd+right"
- moveEditorToPreviousGrou: "ctrl+cmd+left"
- 컬럼 단위 선택: Hold down `Cmd + Shift + Option` and use the arrow keys
- replace string: cmd + d
---
- ls -l bytecode.hex // 배포된 바이트 코드(deployedBytecode in json) 사이즈를 알아내는 방법
- py 1323/23         // py 셸 함수 이용하기
- echo 'export PATH="/usr/local/opt/go@1.21/bin:$PATH"' >> /Users/jay/.zshrc
- egrep -irnH --exclude-dir=.git 'test test test' ./ <== 모든 파일 확장자 검색
- egrep -irnH --include=\*.ts --exclude-dir=.git 'test test test' ./
- egrep -irnH --include=\*.{ts,sol} --exclude-dir=.git 'test test test' ./
- ps aux | grep postgres
- tar --exclude='node_modules' -cvzf bccard.tar.gz bccard
- tar -xvzf xxx.tar.gz -C ./data
- zip -r ~/temp/my-archive.zip . -x '*.git*' -x '*node_modules*'
- unzip my-archive.zip -d data //data 폴더에 풀고 싶을때.
- history -100


🎂🏓🦋⚾️⚽️🏀🏈🪀🎾🐳🍀🌸🌼🏆😈🐹🦁🔹🔸💎♦️💥🔥🐶🚘🎱※반짝🌟🙌🔴👍🪣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🅰️🅱️❌⛔⬆️▶️
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴

🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾🎾
### gpt chatgpt
List the models
```
chatgpt --list-models
```

Set a model
```
chatgpt --set-model o1-mini
```

🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀
### foundry
```
forge script script/poohnet-fund/DeployPoohnetFund.s.sol --rpc-url localnet  --private-key $PRIVATE_KEY --broadcast
cast call $POOHNET_FUND_CONTRACT_ADDRESS "geOwner()" --rpc-url $LOCALNET_RPC_URL
cast balance 0xE024589D0BCd59267E430fB792B29Ce7716566dF --rpc-url $LOCALNET_RPC_URL
cast send $POOHNET_FUND_CONTRACT_ADDRESS --value 2ether --private-key $PRIVATE_KEY
cast send $POOHNET_FUND_CONTRACT_ADDRESS "transferBudget(address,uint256)" 0xE024589D0BCd59267E430fB792B29Ce7716566dF 1000000000000000000 --rpc-url $LOCALNET_RPC_URL --private-key $PRIVATE_KEY
cast balance 0xE024589D0BCd59267E430fB792B29Ce7716566dF --rpc-url http://localhost:8545
cast sig "calculatePower(uint256,uint256)"
cast storage 0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c 0 --rpc-url https://rpc.ankr.com/bsc
cast chain-id --rpc-url https://rpc.ankr.com/bsc
cast tx 0x3f6da406747a55797a7f84173cbb243f4fd929d57326fdcfcf8d7ca55b75fe99 --rpc-url https://rpc.ankr.com/bsc
cast block --help
cast 4byte 88303dbd <= signame 가져오기
cast sig 'buyTickets(uint256,uint32[])' <= sig 가져오기
cast --calldata-decode
cast 4byte-decode 0xa9059cbb000000000000000000000000e78388b4ce79068e89bf8aa7f218ef6b9ab0e9d00000000000000000000000000000000000000000000000000174b37380cea000
cast calldata-decode "transfer(address,uint256)" \
  0xa9059cbb000000000000000000000000e78388b4ce79068e89bf8aa7f218ef6b9ab0e9d0000000000000000000000000000000000000000000000000008a8e4b1a3d8000
컨트랙트 바이트 코드 가져오기
cast code 0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c --rpc-url https://rpc.ankr.com/bsc
```

```
testp:; forge test -vvvv --match-test test_passERC721Transfer
testp2:; forge test -vvvv --match-contract TokenReceiverPluginTest
```

🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼
🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼🌼
### Toolkit
💎 Automator
shift cmd x
    keystroke ": show me corrected version for my english, and answer my message in detail"
shift cmd ,
    keystroke ": create sentence with this text"
shift cmd '
    keystroke ": translate into korean and explain in english"
shift cmd \
    keystroke ": summarize this in brief"
shift cmd p
    keystroke ": translate into english and answer in english"

💎 cdk
- npm install -g aws-cdk
- 이것의 장점은 코드상에서 바로 deploy할 수 있다는 것이다.
- cdk deploy
- New repository secret in github -> settings -> Secrets and variables
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
- After deploying, CloudFormation -> 스택 -> 출력 -> Url 확인


💎 Calling balanceOf 
```
cast call 0x3a7655D710E1ee579275e5F4fa2E4c2D4580BbE1 \
  "balanceOf(address)" 0xA100Cbb212fdB5Ba02F6CFB5694b04354799a1b1 \
  --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545

cast send 0x3a7655D710E1ee579275e5F4fa2E4c2D4580BbE1 "balanceOf(address account)" 0xA100Cbb212fdB5Ba02F6CFB5694b04354799a1b1 --rpc-url  http://127.0.0.1:8545 --private-key 0x58984b2bf6f0f3de4f38290ed3c541ac27bac384b378073ab133af8b314a1887 \
  --gas-limit 200000
```
Make this cast rpc eth_call format

💎 Etherscan
https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=20000000000&apikey=G3CC3P4J717124Y31J9ZMPBH2G4KPY98FT

💎 Foundry basic
```
curl -L https://foundry.paradigm.xyz | bash
export PATH="$HOME/.foundry/bin:$PATH"
source ~/.zshrc   # or ~/.bashrc, whichever you edited
foundryup
forge --version
forge init // Cannot run `init` on a non-empty directory.
forge install
---
forge-std/=lib/forge-std/src/
import {Test, console} from "forge-std/src/Test.sol";
---
console.log(string.concat("fee: ", vm.toString(fee)));
console.log("USDC:", address(USDC));
```

💎 fastest python dev
brew install pipenv
pipenv --python 3.11.8 // 새로운 폴더 만들어서 해야함 & ~/.local/share/virtualenvs에 생김.
pipenv shell // 이걸 호출하면 위 폴더에서 자동으로 찾아줌. 
pipenv install requests
pipenv run python main.py // pipenv run을 붙여야 virtual env에서 실행함.
exit // deactivate가 아님. 잘못하면 터미널을 빠져나감

💎 ChatGPT - Buddy
Guidance for you, Codex: Show me the original sentence, a grammatically and semantically correct version (as few corrections as possible), a Korean translation. And also show me your recommened version and the concise, natural, not to formal version suitible for team meeting. Each version is written with a simple prefix in one line. And then if there are any idioms or different words, explain them very briefly after the translation. If the original sentences are written in Korean, you should start with the sentences translated into English as original ones. And evaluate the my english proficiency level from 1 to 10, 10 being native speaker level anc check the problems in my english brefely.

And then, thoroughly respond to the content of my message and briefly explain any relevant background, technology, current state, or future outlook.

if I write ":ca", check my sentences for grammar unconditionally before answring.

🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸
### Toolkit New
#### 💎 Run hardhat node (🔥hardhat.config.ts를 읽어들임, 31337)
```
nvm use 20 && NODE_OPTIONS="--max-old-space-size=8192" yarn hardhat node --port 8545 
```

#### 💎 MCP
```
npx v0-mcp-server // v0
```
Create a Next.js middleware that checks for a valid JWT in cookies and redirects unauthenticated users to `/login`. use context7

#### 💎 langchain ai 
// 아무 폴더에서나 아래 명령어를 차례로 실행 
brew install uv
uv init
uv add jupyterlab
uv run jupyter lab

#### 💎 fastest node dev
ext         // Move to ~/work/web/exlang/ext directory
nvm use 20
yarn
npx ts-node ex.ts

#### 💎 aimond token deployment
yarn deploy:all:bsc
yarn set:global-start-time:bsc
yarn set-owner:bsc
yarn fund:all:bsc
yarn transfer:safe:bsc
yarn info:all:bsc

#### 💎 aimond token toolkit setup
yarn db:setup     // backend
yarn start        // backend
yarn start:debug  // frontend

#### 💎 git
gh auth login // code는 command 로그에 나타남.
gh repo list linked0 --limit 1000 | sort 
git submodule update --init // 처음에 submodule 파일 가져오기
git submodule update --remote // submodule을 최신 커밋으로 업데이트, commit 해야함.
git clone <repository_url> <new_folder_name> // 특정 폴더에 클론하기 
git show --name-only HEAD // 현재 커밋의 파일 목록 확인
git show --stat HEAD // 마지막 커밋 메시지 확인 
git reset --hard Abdulkarim4u/feature/added-charts
echo "docs/task/task.local.md" >> .git/info/exclude // git의 트래킹에서 빠짐. 리파지토리에서의 상대경로.

#### 💎 init **nostra**
yarn compile // in contracts
yarn deploy:bsc-testnet // in contracts
npm install -g yalc // in sdk
yarn build // in sdk for publishing package
yarn list:addresses // in sdk
npm login // in sdk
npm publish  --access public // in sdk
yalc push // in sdk just for yalc
yalc add @nostra-dev/sdk // in api and web
yarn check-sdk // in api and web 
yarn fresh-start // db:reset-all & provision:all & rebalance
yarn rebalance
yarn bot:dry-run // 이건 필요할 때 실행하면 됨
yarn show:world-cup // or show:mvp

#### 💎 command
pushd .
popd
lsof -nP -iTCP:4000 -sTCP:LISTEN
pkill -f "http.server 51225"
pgrep -fl my-process
ps aux | grep <process_name>
git push origin main:gh-pages
grep -rn --include={"*.sh","*.txt"} "DIR_NAME" . // include 중간에 스페이스 넣으면 안됨

🎂🌼🏓🦋⚾️🏐⚽️🏀🏈🪀🎾🐳🍀🌸🏆😈🐹🦁🔹🔸💎♦️💥🔥🐶🦄🚘🎱※반짝🌟🙌
🔴👍🪣 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟🅰️🅱️❌⛔▶️
🏀[dev]([https://bit.ly/3MVG5AN), 🎾[dev txt](https://bit.ly/3MT0VRb)
⚽️[Miki](https://bit.ly/421Gf1x), 🏈[Miki-Sum](https://bit.ly/4iWn0fY)
🏓[Work Env](./zsub/work-env.md)

