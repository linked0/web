# TransactionDelegator Project

## 스마트 컨트랙트 환경 설정

### node 18 버전 설정
본 프로젝트는 node 18 버전을 사용함으로 다음의 명령을 node 18 버전을 설정한다. 
```
nvm install 18
nvm use 18
```

만약 nvm이 설치되지 않았을 경우 다음의 명령의 하나를 사용하여 nvm을 설치한다.
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

### 기본 명령
패키지 설치
```
yarn
```
테스트
```
yarn test
```
컴파일 생성 파일 제거
```
yarn clean
```
린트 실행
```
yarn lint
```

## 로컬넷에서 컨트랙 배포 테스트 하기
프로젝트 루트 디렉토리에서 .env 설정 파일 복사
```
cp .env.sample .env
```
아래의 명령어로 로컬넷을 실행시킨다.
```
yarn run:localnet
```

`TransactionDelegator`와 `ERC20` 컨트랙트를 배포한다.
```
yarn deploy:localnet
```
실행후 배포된 컨트랙트 주소를 .env의 `MINTABLE_TOKEN`과 `TRANSACTION_DELEGATOR_CONTRACT`에 지정한다.
```
$ hardhat run scripts/deploy.ts --network localnet
Deployed MINTABLE_TOKEN: 0x67d269191c92Caf3cD7723F116c85e6E9bf55933
Deployed TRANSACTION_DELEGATOR_CONTRACT: 0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E
```
.env 파일
```
MINTABLE_TOKEN=0x67d269191c92Caf3cD7723F116c85e6E9bf55933
TRANSACTION_DELEGATOR_CONTRACT=0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E
```

## 로컬 서버 세팅 및 테스트

### 데이터베이스 생성 및 설정
다음과 같이 MySQL에서 `miniproj' 데이터베이스를 생성한다.
```
mysql -u root -p
CREATE DATABASE miniproj;
```

데이터베이스 이름, 사용자, 패스워드를 .env 파일에 다음과 같이 저장한다.
```
DATABASE_NAME=miniproj
DATABASE_USER=root
DATABASE_PASSWORD=12345678
```
### 서버 npm 패키지 인스톨 및 서버 실행
하위의 `server` 폴더로 이동하고 다음의 명령으로 서버를 실행한다.
```
npm install
npm start
```

### 로컬넷 실행 확인
[로컬넷에서 컨트랙 배포 테스트 하기](#로컬넷에서-컨트랙-배포-테스트-하기)에 설명된대로 로컬넷을 실행하고 컨트랙트가 배포된 상태여야 한다.

### `mint`, `balanceOf` 요청
다음과 같이 로컬 서버에 `mint`를 요청한다. 요청 계정 주소는 `Metamask`를 통해서 생성된 계정을 사용할 수 있다.
```
curl -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -H "Content-Type: application/json" -X POST http://localhost:3000/mint
```
다음과 같은 응답을 받으면 성공.
```
{"id":66,"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F","index":0,"tx":"0x","status":0,"createdAt":"2024-05-07T13:42:04.016Z","updatedAt":"2024-05-07T13:42:04.018Z"}
```

방금 mint된 토큰이 요청 계정으로 정상 입금되었는지 확인한다.
```
curl -H "Content-type: application/json" -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -X GET "http://localhost:3000/balanceOf"
```
다음과 같이, 응답으로 전달된, 계좌 잔액을 확인한다.
```
"1000000000000000000"
```
