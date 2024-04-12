# Contents
- [Deployment of contracts](#deployment-of-contracts)
  - [Prerequisites](#prerequisites)
  - [Deploying ConduitController contract](#deploying-conduitcontroller-contract)
  - [Creating Conduit](#creating-conduit)
  - [Deploying Seaport contract](#deploying-seaport-contract)
  - [Deploying AssetContractShared contract](#deploying-assetcontractshared-contract)
  - [Deploying SharedStorefrontLazyMintAdapter contract](#deploying-sharedstorefrontlazymintadapter-contract)
  - [Setting the shared proxy of AssetContractShared](#setting-the-shared-proxy-of-assetcontractshared)
- [Minting AssetContractShared NFT Tokens](#minting-assetcontractshared-nft-tokens)
- [Trading NFTs with the Seaport contract](#trading-nfts-with-the-seaport-contract)
- [Notes](#notes)
- [Trasnfer of AssetContractShared Tokens with Seaport](#transfer-of-assetcontractshared-tokens-with-seaport)
  - [Prerequisites](#prerequisites-1)
  - [Fulfill through the Seaport and SharedStorefrontLazyMintAdapter without Conduit](#fulfill-through-the-seaport-and-sharedstorefrontlazymintadapter-without-conduit)
  - [Fulfill through the Seaport, Conduit, and SharedStorefrontLazyMintAdapter](#fulfill-through-the-seaport-conduit-and-sharedstorefrontlazymintadapter)
  - [Fulfill only through the Seaport](#fulfill-only-through-the-seaport)

All the description is for the [Bosagora Mainnet](https://boascan.io).


# Deployment of contracts
BOASpace 컨트랙트 배포시 다음에 기술된 순서가 지켜져야 합니다.

## Prerequisites
프로젝트 루트 디렉토레에서 필요한 프로그램과 Node 패키지를 설치합니다.
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source .bashrc
nvm install 16
nvm use 16
npm i -g yarn
yarn install
```

루트 디렉토리에 `.env` 파일 생성합니다.
```
cp .env.sample .env
```

`.env` 파일에 BOASpace 관리자(배포자)키가 지정되어야 하고, 이 키는 `Admin1`이라는 이름으로 재단으로부터 부여된 것으로 Mainnet에 컨트랙트를 배포할 때 사용됩니다. 다음은 TestNet에서 사용되는 관리자 키입니다.
```
ADMIN_KEY=0xd7912c64125d466be55d2ac220834571a39ff9abeb9ad6dfb6afe9a3a433ba7d
```

## Deploying ConduitController contract
다음의 스크립트를 사용하여 컨트랙트를 배포합니다.
```
npx hardhat run script/deploy_conduit_controller.ts --network mainnet
```
컨트랙트가 정상적으로 배포되면 다음과 같은 로그가 나타납니다.
```
ConduitController - deployed to: 0x4d2335c88eb74ed54CEbA06Bb8DB69c4eab5feaD
```

로그상의 `ConduitContraoller` 주소를 `.env` 파일의 `CONDUIT_CONTROLLER_ADDRESS`에 다음과 같이 지정합니다.
```
CONDUIT_CONTROLLER_ADDRESS=0xFB15f7cB1E06544A791DbEd6AfdB9C705bF5eF60
```

## Creating Conduit
**BOASpace는 디폴트 Conduit을 사용하지 않으므로 이 단계를 건너뛰어도 됩니다.**

디폴트 Conduit은 `SharedStorefrontLazymintAdapter` 컨트랙트 배포시에 생성자의 인자로 사용됩니다.

디폴트 Conduit을 생성하기 전에 `.env` 파일에 다음과 같이 사용할 Conduit 키를 지정합니다. Mainnet의 디폴트 Conduit 키는 `Admin1`의 주소로부터 생성할 수 있습니다. 다음은 Mainnet에서 사용되는 디폴트 Conduit 키입니다.
```
CONDUIT_KEY=0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E000000000000000000000000
```

Conduit 키는 다음의 조합으로 생성될 수 있습니다. `[address]`는 의 사용자 계정의 주소입니다.
```
`[address]` + `000000000000000000000000`
```

다음의 스크립트로 Conduit를 생성합니다.
```
npx hardhat run script/create_conduit.ts --network mainnet
```

다음은 생성된 Conduit의 정보입니다.
```
$ npx hardhat run script/get_conduit.ts --network testnet   
Conduit address: 0x65a14fDc9d62fc15454FE3ba1b59ABc59FF58A1b
conduitKey:  0xdedF18e2fdf26Ec8f889EfE4ec84D7206bDC431E000000000000000000000000
```

## Deploying Seaport contract
다음의 스크립트를 사용하여 컨트랙트를 배포합니다.
```
npx hardhat run script/deploy_seaport.ts --network mainnet
```
컨트랙트가 정상적으로 배포되면 다음과 같은 로그가 나타납니다.
```
Seaport - deployed to: 0xB38C5e7ecAe4a2E3B11E69AA98D9C5F087De8C90
```

로그상의 `Seaport` 주소를 `.env` 파일의 `SEAPORT_ADDRESS`에 다음과 같이 지정합니다.
```
SEAPORT_ADDRESS=0xB38C5e7ecAe4a2E3B11E69AA98D9C5F087De8C90
```

디폴트 Conduit을 사용하는 경우에 다음의 스크립트로 Conduit을 등록합니다. BOASpace는 디폴트 Conduit을 사용하지 않으므로 다음의 단계를 건너뛰어도 됩니다.
```
npx hardhat run script/update_conduit_channel.ts --network mainnet
```

## Deploying AssetContractShared contract
**`AssetContractShared`는 이미 Testnet과 Mainnet에 배포되어 있습니다.**
```
AssetContractShared on Testnet: 0x2fddd0f488B767E8Dd42aE4E60f0685A2e15b1Fd
AssetContractShared on Mainnet: 0xfC9f0cb32588433C160ad1E305027EAdc7bdbbE8
```

새로운 `AssetContractShared` 컨트랙트 배포시 다음의 절차를 따릅니다.

`.env` 파일에 `name`, `symbol`, `templateURI` 정보를 다음과 같이 지정합니다. `templateURI`는 선택사항입니다.
```
# Parameters of AssetContractShared constructor
ASSET_CONTRACT_NAME="BOASPACE Collections"
ASSET_CONTRACT_SYMBOL=BOASPACESTORE
ASSET_CONTRACT_TEMPLATE_URI=
```
다음의 스크립트를 사용하여 컨트랙트를 배포합니다.
```
npx hardhat run script/deploy_asset.ts --network mainnet
```
컨트랙트가 정상적으로 배포되면 다음과 같은 로그가 나타납니다.
```
AssetContractShared - deployed to: 0x5d41eb6b532660932627E3A9BaE5B94B797F18b5
```

로그상의 `AssetContractShared` 주소를 `.env` 파일의 `ASSET_CONTRACT_SHARED_ADDRESS`에 다음과 같이 지정합니다.
```
ASSET_CONTRACT_SHARED_ADDRESS=0x5d41eb6b532660932627E3A9BaE5B94B797F18b5
```

다음의 스크립트로 배포된 `AssetContractShared` 컨트랙트 정보를 확인할 수 있습니다.
```
npx hardhat run script/check_asset_contract.ts --network mainnet
```
```
====== AssetContractShared information ======
address: 0x5d41eb6b532660932627E3A9BaE5B94B797F18b5
name: BoaSpace Collections
symbol: BOASTORE
templateURI: 
```

## Deploying SharedStorefrontLazyMintAdapter contract
다음의 스크립트를 사용하여 컨트랙트를 배포합니다.
```
npx hardhat run script/deploy_lazymint_adapter.ts --network mainnet
```

만약 디폴트 Conduit을 사용한다면 다음의 명령을 이용하여 컨트랙트를 배포합니다. BOASpace에서는 디폴트 Conduit을 사용하지 않으므로 현재 이 명령을 사용되지 않습니다.
```
CONDUIT=true npx hardhat run script/deploy_lazymint_adapter.ts --network mainnet
```

컨트랙트가 정상적으로 배포되면 다음과 같은 로그가 나타납니다.
```
SharedStorefrontLazyMintAdapter - deployed to: 0xE11FDE48B267C0d4c56e38E7c7868aE5aE2C59Dd
```

로그상의 `SharedStorefrontLazymintAdapter` 주소를 `.env` 파일의 `LAZY_MINT_ADAPTER_ADDRESS`에 다음과 같이 지정합니다.
```
LAZY_MINT_ADAPTER_ADDRESS=0xE11FDE48B267C0d4c56e38E7c7868aE5aE2C59Dd
```

## Setting the shared proxy of AssetContractShared
**다음의 프락시 세팅은 AssetContractShared를 배포한 키를 이용하여 실행합니다.**

배포된 `SharedStorefrontLazyMintAdapter` 컨트랙트를 `AssetContractShared`의 `shared proxy`로 지정해야 합니다. `AssetContractShared` NFT의 `transfer`함수는 소유자나 지정된 `shared proxy`에 의해서만 호출될 있도록 되어 있기 때문입니다.
```
npx hardhat run script/add_shared_proxy.ts --network mainnet
```

# Minting AssetContractShared NFT Tokens

## Set information for minting
`.env` 파일에 BOASpace `AssetContractShared` 민팅 관리자키가 지정되어야 하고, 이 키는 `Admin2`이라는 이름으로 재단으로부터 부여된 것으로 Mainnet에 컨트랙트를 배포할 때 사용됩니다. 해당키를 `SPIDER_VERSE_NFT_CREATOR_KEY`에 세팅합니다.

새로운 NFT 토큰을 민팅하기 위해서 다음의 정보를 `.env`에 세팅합니다.
```
SPIDER_VERSE_NFT_INDEX=1
SPIDER_VERSE_NFT_QUANTITY=100
SPIDER_VERSE_NFT_DATA=https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7
SPIDER_VERSE_NFT_CREATOR_KEY=bacfa3fbe768c1665feee09af7182ae53ca9a334db747b3751149f81e448ac26
```

## Mint new NFT tokens
다음의 스크립트를 이용하여 위에 지정한 NFT 토큰을 민팅합니다.
```
npx hardhat run script/spider-verse/mint.ts --network mainnet
```

민팅의 결과가 다음과 같이 로그에 나타납니다.
```
Combined tokenId: 78124813713363012903054561010911293954183699126175542122344455273147682259044 ( 0xacb913db781a46611faa04ff6cb9a370df069eed0000000000005e0000000064 )
Token minted to: 0xAcb913db781a46611fAa04Ff6Cb9A370df069eed
```

## Check the information on the minted NFT token
민팅한 토큰의 아이디를 `.env`에 다음과 지정합니다.
```
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=0xacb913db781a46611faa04ff6cb9a370df069eed0000000000005e0000000064
```

다음의 스크립트로 민팅된 NFT 토큰 정보을 확인할 수 있습니다.
```
npx hardhat run script/check_nft.ts --network mainnet
```

다음은 실행 결과입니다.
```
====== Minted NFT information ======
tokenId: BigNumber { value: "78124813713363012903054561010911293954183699126175542122344455273147682259044" }
tokenId(HEX): 0xacb913db781a46611faa04ff6cb9a370df069eed0000000000005e0000000064
uri: https://ipfs.io/ipfs/QmXdYWxw3di8Uys9fmWTmdariUoUgBCsdVfHtseL2dtEP7
creator: 0xAcb913db781a46611fAa04Ff6Cb9A370df069eed
token index: 94
max supply: 100
balance of creator: 100
```

## Trading NFTs for checking
민팅된 NFT 토큰을 다음의 절차를 통해서 전송할 수 있습니다.

`ORDER_NFT_SELLER_KEY`에 NFT 소유자의 키를 지정하고, `ORDER_NFT_BUYER_KEY` 전송받을 구매자의 키를 지정합니다.
```
ORDER_NFT_BUYER_KEY=0x...
ORDER_NFT_SELLER_KEY=0x...
```

다음의 스크립트로 NFT를 전송합니다.
```
npx hardhat run script/fulfill/order_seaport_erc1155_to_boa.ts --network mainnet
```

다음의 스크립트로 전송 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network mainnet
```

다음과 같이 BOA, WBOA, NFT의 정보가 나타납니다.
```
====== Asset Token
contract address: 0x2fddd0f488B767E8Dd42aE4E60f0685A2e15b1Fd
NFT creator: 0x414BB02bDe65Ba63c9A99709b388E30669Bf2De7
====== NFT seller
address: 0x414BB02bDe65Ba63c9A99709b388E30669Bf2De7
BOA     : 11056865472547138871909
WBOA    : 5100000000000000000
Asset amount    : 87
====== NFT buyer
address: 0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53
BOA     : 995179832817305886482
WBOA    : 1200000000000000000
Asset amount    : 113
```

# NFTs of the BOB's project

## Mainnet BOB's project
다음은 `Admin2` 키로 Mainnet에 민팅된 `BOB's project` NFT의 정보입니다.
```
Minted at 2022.12.19 16:30 KST
Contract: 0xfC9f0cb32588433C160ad1E305027EAdc7bdbbE8
Token Id: 43667820570476046280485912386194575442785224451789146690794321896035701489864
Metadata: https://ipfs.io/ipfs/QmYsGGFqBLXCNtXfcmPeVwVxtgVjGQXDFHqZzRu6FxTYvc
Creator: 0x608b1C4e78a37b459D7Cf51F9e31027DAa4f0C0B
Token Index: 0
Max Supply: 200
```

## Testnet BOB's project
다음은 Testnet에 민팅된 `BOB's project` NFT의 정보입니다.
```
TokenId: 29534064577826613153035026441167017977610697301918714276121482769509518409928
Contract: 0x2fddd0f488B767E8Dd42aE4E60f0685A2e15b1Fd
Metadata:  https://ipfs.io/ipfs/QmYsGGFqBLXCNtXfcmPeVwVxtgVjGQXDFHqZzRu6FxTYvc
Creator: 0x414BB02bDe65Ba63c9A99709b388E30669Bf2De7
Token Index: 131
Max Supply: 200
```

# Notes
* 거래 실행시 모든 수수료는 판매자에게 전달된 판매 대금에서 나오는 것이므로, 판매자의 ERC20 토큰에 대해서 `approve` 호출을 통해서 Seaport 컨트랙트가 권한을 가질 수 있도록 해야 한다.

# Transfer of AssetContractShared Tokens with Seaport
다음의 스크립트를 이용하여 테스트넷 상에서 NFT를 거래할 수 있습니다.

다음의 세가지 방법으로 `AssetContractShared` 토큰을 거래합니다.
1. `Seaport`와 `SharedStorefrontLazyMintAdapter` 컨트랙트를 이용하기
2. `Seaport`, `Conduit`, `SharedStorefrontLazyMintAdapter` 컨트랙트 이용하기
3. `Seaport` 컨트랙트 이용하기

거래에 대한 내용은 [TestNet Scan](https://testnet.boascan.io) 사이트에서 확인할 수 있습니다.

## Prerequisites
'.env' 파일에 다음과 같이 거래하고자 하는 NFT의 아이디를 지정합니다.
```
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=29534064577826613153035026441167017977610697301918714276122831730638822834376
```

그리고, 해당 NFT의 판매자(소유자)와 구매자의 키를 `.env` 파일에 다음과 같이 지정합니다.
```
ORDER_NFT_BUYER_KEY=0x158ad623fa14d8ca6bce416b877905b2d11d3842ddd4adbb71332e809263abb5
ORDER_NFT_SELLER_KEY=0xbacfa3fbe768c1665feee09af7182ae53ca9a334db747b3751149f81e448ac26
```

- `ORDER_NFT_BUYER_KEY`는 NFT의 구매자입니다.
- `ORDER_NFT_SELLER_KEY`는 NFT의 판매자이자 소유자입니다.

다음의 스크립트 실행을 통해서 판매자와 구매자의 상태를 확인할 수 있습니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet
```
스크립트를 실행하면 다음과 같이 BOA, WBOA, NFT 정보를 출력합니다.
```
====== Asset Token: 0x2fddd0f488B767E8Dd42aE4E60f0685A2e15b1Fd
token ID: 9490434390849790054731572076376116650519590089042247525170096698442617143872
NFT creator: 0x14Fb65402700B823Baf0C75f658509B0375fe5fD
====== NFT seller: 0x14Fb65402700B823Baf0C75f658509B0375fe5fD
BOA: 3858.120525058725660969
WBOA: 920.925000000000000000
NFT: 999737
====== NFT buyer: 0xAcb913db781a46611fAa04Ff6Cb9A370df069eed
BOA: 4107.398464395564412129
WBOA: 290.900000000000000000
NFT: 250
```

## Fulfill through the Seaport and SharedStorefrontLazyMintAdapter without Conduit
다음의 세가지 예제는 **Conduit**을 사용하지 않고, Seaport와 SharedStorefrontLazyMintAdapter 컨트랙트를 사용하는 거래에 대한 예제입니다.

### 1. NFT를 제공하고 BOA를 대금으로 받기
판매자가 한 개의 NFT를 제공하고, 0.1 `BOA`를 받는 거래에 대한 내용입니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_seaport_erc1155_to_boa.ts --network testnet
```
다음은 거래의 상세정보입니다.
```
order: {
    parameters: {
        offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
        zone: '0x0000000000000000000000000000000000000000',
        offer: [ [Object] ],
        consideration: [ [Object] ],
        totalOriginalConsiderationItems: 1,
        orderType: 0,
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '0x1c667696c5673688edb7b0ed3f7e9f25664879fb65446dffec4762e34b8fb6f6',
        conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
        startTime: 0,
        endTime: BigNumber { value: "5172014448931175958106549077934080" }
    },
    signature: '0xa7662b3c63c564ca84d5d666bb15b38789759736ca5daab4993a68b9c1928ad41cdefddba6a6e283070401006c61aa012ff7339d2526f4d69e7fb60cd1e284bb1b',
    numerator: 1,
    denominator: 1,
    extraData: '0x'
}
```
```
offer: [
{
    itemType: 3,
    token: '0x8a8f3d7b1D6Eebe8D227499B563bD0319Ec8CBC0',
    identifierOrCriteria: BigNumber { value: "78124813713363012903054561010911293954183699126175542122344455181888217153636" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" }
}
]
```
```
consideration: [
{
    itemType: 0,
    token: '0x0000000000000000000000000000000000000000',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
}
]
```

다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet
```

### 2. 구매자가 WBOA를 제공하고 NFT 받기
구매자가 0.1 `WBOA` 제공하고, 한 개의 `NFT`를 받는 거래입니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_seaport_wboa_to_erc1155.ts --network testnet
```
다음은 거래의 상세정보입니다.
```
order: {
    parameters: {
        offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
        zone: '0x0000000000000000000000000000000000000000',
        offer: [ [Object] ],
        consideration: [ [Object] ],
        totalOriginalConsiderationItems: 1,
        orderType: 1,
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '0xc7572075feaac4628eeeb0b8383eee2c5693699efa7d6bb87a3f37e36e9a6d69',
        conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
        startTime: 0,
        endTime: BigNumber { value: "5172014448931175958106549077934080" }
    },
    signature: '0x32303a8c8876c47e30e5c89179942b29ebac2743298d6fcaaa94e0d656a9dfab761a087ffb8d7726dfff0c945ebf069c1f66940f3557a86d6247047782627ba01b',
    numerator: 1,
    denominator: 1,
    extraData: '0x'
}
```
```
offer: [
{
    itemType: 1,
    token: '0x7700a9Bc2c4a523EFFd6B506b6f78872F247161C',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" }
}
]

```
```
consideration: [
{
    itemType: 3,
    token: '0x8a8f3d7b1D6Eebe8D227499B563bD0319Ec8CBC0',
    identifierOrCriteria: BigNumber { value: "78124813713363012903054561010911293954183699126175542122344455181888217153636" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
}
]
```

다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet
```

### 3. 구매자가 WBOA를 제공하고 `Lazy Mint`되는 NFT 받기
구매자가 0.1 `WBOA`를 제공하고, 한 개의 `NFT`를 받는 거래로서, 토큰이 `Lazy Mint` 됩니다.

`Lazy Mint`를 위해서 [이 섹션](#set-information-for-minting)에 기술된 것을 참고하여 `.env`에 필요한 정보를 지정합니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_seaport_wboa_to_erc1155_lazymint.ts --network testnet
```
다음은 거래의 상세정보입니다.
```
order: {
  parameters: {
    offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
    zone: '0x0000000000000000000000000000000000000000',
    offer: [ [Object] ],
    consideration: [ [Object] ],
    totalOriginalConsiderationItems: 1,
    orderType: 1,
    zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: '0xe1ea5147e95f8f98887220b3aedf7940b7524d4f20aefe03b6bdc3c2e7396a31',
    conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
    startTime: 0,
    endTime: BigNumber { value: "5172014448931175958106549077934080" }
  },
  signature: '0x45e85622f37be9d0703cee52225ecefb41acae873ef2df295b386393a5d9e5236eb0c204f333daa769ccd22822ed120888c84d59a8cb87d43e3f8efe69cb011f1b',
  numerator: 1,
  denominator: 1,
  extraData: '0x'
}
```
```
offer: [
  {
    itemType: 1,
    token: '0x7700a9Bc2c4a523EFFd6B506b6f78872F247161C',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" }
  }
]
```

```
consideration: [
  {
    itemType: 3,
    token: '0x790c4c73155F89F93ad18e3b3B483B688E867c4b',
    identifierOrCriteria: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
  }
]
```

가장 마지막 로그의 내용은 Lazy Mint된 NFT의 아이디를 표시합니다.
```
NFT to transfer: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" }
```

위의 로그에서 표시된 NFT의 아이디를 `.env` 파일에 다음과 같이 저장합니다.
```
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=9490434390849790054731572076376116650519590089042247525169967102305585070280
```
다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet 
```

### 4. 판매자가 `Lazy Mint`되는 NFT 주고 BOA 받기
판매자가 한 개의 NFT를 제공하고 0.1 `BOA`를 받는 거래로서, 토큰이 `Lazy Mint` 됩니다.

`Lazy Mint`를 위해서 [이 섹션](#set-information-for-minting)에 기술된 것을 참고하여 `.env`에 필요한 정보를 지정합니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_seaport_erc1155_to_boa_lazymint.ts --network testnet
```
다음은 거래의 상세정보입니다.
```
order: {
  parameters: {
    offerer: '0x414BB02bDe65Ba63c9A99709b388E30669Bf2De7',
    zone: '0x0000000000000000000000000000000000000000',
    offer: [ [Object] ],
    consideration: [ [Object] ],
    totalOriginalConsiderationItems: 1,
    orderType: 0,
    zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: '0x7055472912195a36c3fc4e4e3faeeec05d8b42f9bc2e45c4ee5d2af8d7315ac8',
    conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
    startTime: 0,
    endTime: BigNumber { value: "5172014448931175958106549077934080" }
  },
  signature: '0xd7b3ab659dbd3410358a5c083b39649785a223d0f05867a69243a3598d456804070ac60b05a1ea506718b820b0a6bfd31b18cf7903af3a7dea737bcaf1a43a2c1c',
  numerator: 1,
  denominator: 1,
  extraData: '0x'
}
```
```
offer: [
  {
    itemType: 3,
    token: '0x790c4c73155F89F93ad18e3b3B483B688E867c4b',
    identifierOrCriteria: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" }
  }
]
```
```
consideration: [
  {
    itemType: 0,
    token: '0x0000000000000000000000000000000000000000',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" },
    recipient: '0x414BB02bDe65Ba63c9A99709b388E30669Bf2De7'
  }
]
```

가장 마지막 로그의 내용은 Lazy Mint된 NFT의 아이디를 표시합니다.
```
NFT to transfer: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" }
```

위의 로그에서 표시된 NFT의 아이디를 `.env` 파일에 다음과 같이 저장합니다.
```
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=9490434390849790054731572076376116650519590089042247525169967102305585070280
```
다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet 
```

## Fulfill through the Seaport, Conduit, and SharedStorefrontLazyMintAdapter
다음의 세가지 예제는 **기본 Conduit**을 사용하고, Seaport와 SharedStorefrontLazyMintAdapter 컨트랙트를 사용하는 거래에 대한 예제입니다.

### 1. 구매자가 WBOA 제공하고 NFT 받기
구매자가 0.1 `WBOA` 제공하고, 한 개의 `NFT`를 받습니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_conduit_wboa_to_erc1155.ts --network testnet
```
다음은 거래의 상세정보입니다. 기본 Conduit 키가 지정되어 있음을 확인할 수 있습니다.
```
order: {
  parameters: {
    offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
    zone: '0x0000000000000000000000000000000000000000',
    offer: [ [Object] ],
    consideration: [ [Object] ],
    totalOriginalConsiderationItems: 1,
    orderType: 1,
    zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: '0x9f91dd2c2eb0c404bbc70c3d8a9395b14a1541fb6b905bb4f4355f1ea18f3e6f',
    conduitKey: '0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42000000000000000000000000',
    startTime: 0,
    endTime: BigNumber { value: "5172014448931175958106549077934080" }
  },
  signature: '0x450b76f99f3e14c079cd0af21018bac9ca2eb0e6d3e1ffb27a189f478462554d237a6b7c20bf1b7c7ac0ba48531ce09c701264edf6a4586df899f6b6568e7ef41c',
  numerator: 1,
  denominator: 1,
  extraData: '0x'
}
```
```
offer: [
  {
    itemType: 1,
    token: '0x7700a9Bc2c4a523EFFd6B506b6f78872F247161C',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" }
  }
]
```

```
consideration: [
  {
    itemType: 3,
    token: '0x5Ea2E76D2CEA6051bdd1D41eBAebF069BA973642',
    identifierOrCriteria: BigNumber { value: "29534064577826613153035026441167017977610697301918714276122830631127195058376" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
  }
]
```

다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet 
```

### 2. 구매자가 WBOA를 제공하고 `Lazy Mint`되는 NFT 받기
구매자가 0.1 `WBOA`를 제공하고, 한 개의 `NFT`를 받는 거래로서, 토큰이 `Lazy Mint` 됩니다.

`Lazy Mint`를 위해서 [이 섹션](#set-information-for-minting)에 기술된 것을 참고하여 `.env`에 필요한 정보를 지정합니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_lazymint_wboa_to_erc1155.ts --network testnet
```
다음은 거래의 상세정보입니다. 기본 Conduit 키가 지정되어 있음을 확인할 수 있습니다.
```
order: {
  parameters: {
    offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
    zone: '0x0000000000000000000000000000000000000000',
    offer: [ [Object] ],
    consideration: [ [Object] ],
    totalOriginalConsiderationItems: 1,
    orderType: 1,
    zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    salt: '0x9f91dd2c2eb0c404bbc70c3d8a9395b14a1541fb6b905bb4f4355f1ea18f3e6f',
    conduitKey: '0x82fFb1bB229552D020C88b9eE8D5e4042E6Cbd42000000000000000000000000',
    startTime: 0,
    endTime: BigNumber { value: "5172014448931175958106549077934080" }
  },
  signature: '0x450b76f99f3e14c079cd0af21018bac9ca2eb0e6d3e1ffb27a189f478462554d237a6b7c20bf1b7c7ac0ba48531ce09c701264edf6a4586df899f6b6568e7ef41c',
  numerator: 1,
  denominator: 1,
  extraData: '0x'
}
```
```
offer: [
  {
    itemType: 1,
    token: '0x7700a9Bc2c4a523EFFd6B506b6f78872F247161C',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" }
  }
]
```

```
consideration: [
  {
    itemType: 3,
    token: '0x5Ea2E76D2CEA6051bdd1D41eBAebF069BA973642',
    identifierOrCriteria: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
  }
]
```

가장 마지막 로그의 내용은 Lazy Mint된 NFT의 아이디를 표시합니다.
```
NFT to transfer: BigNumber { value: "9490434390849790054731572076376116650519590089042247525169967102305585070280" }
```

위의 로그에서 표시된 NFT의 아이디를 `.env` 파일에 다음과 같이 저장합니다.
```
SPIDER_VERSE_NFT_LAST_COMBINE_TOKEN_ID=9490434390849790054731572076376116650519590089042247525169967102305585070280
```
다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet 
```

## Fulfill only through the Seaport
다음의 예제는 `Conduit`이나 `SharedStorefrontLazyMintAdapter`를 **사용하지 않고**, `Seaport` 컨트랙트만을 사용하는 거래입니다. 판매자가 한 개의 NFT를 제공하고, 0.1 `BOA`를 받습니다.

다음의 스크립트 실행을 통해서 거래를 진행합니다.
```
npx hardhat run script/fulfill/order_asset_erc1155_to_boa.ts --network testnet
```
다음은 거래의 상세정보입니다.
```
order: {
    parameters: {
        offerer: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53',
        zone: '0x0000000000000000000000000000000000000000',
        offer: [ [Object] ],
        consideration: [ [Object] ],
        totalOriginalConsiderationItems: 1,
        orderType: 0,
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '0xa4d4c932828059d2d949ec7744af51c6e5251c8e50666faee7304f361bb609d2',
        conduitKey: '0x0000000000000000000000000000000000000000000000000000000000000000',
        startTime: 0,
        endTime: BigNumber { value: "5172014448931175958106549077934080" }
    },
    signature: '0x084439a1775805d19ca7bd0dc5e626bbf5f355d6f7c0c57df475f37fa40f2fb01c3db8b1a6832b1c311d1b852a0be913d966af8fb18eeeb1ab1ecd7d9b6f63a11c',
    numerator: 1,
    denominator: 1,
    extraData: '0x'
}

```
```
offer: [
{
    itemType: 3,
    token: '0x2fddd0f488B767E8Dd42aE4E60f0685A2e15b1Fd',
    identifierOrCriteria: BigNumber { value: "78124813713363012903054561010911293954183699126175542122344455181888217153636" },
    startAmount: BigNumber { value: "1" },
    endAmount: BigNumber { value: "1" }
}
]
```
```
consideration: [
{
    itemType: 0,
    token: '0x0000000000000000000000000000000000000000',
    identifierOrCriteria: BigNumber { value: "0" },
    startAmount: BigNumber { value: "100000000000000000" },
    endAmount: BigNumber { value: "100000000000000000" },
    recipient: '0x214a3aE4f8A245197db523fb81Dd8aD93c1c7B53'
}
]

```

다음의 스크립트 실행으로 거래 결과를 확인합니다.
```
npx hardhat run script/fulfill/check_fulfill_order.ts --network testnet 
```
