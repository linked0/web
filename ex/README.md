# Sample Hardhat Project
이 프로젝트는 hardhat-deploy를 테스트하기 위해서 생성된 프로젝트.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## History
#### Dec 18, 2023
- ./deploy/002_deploy_lock2.ts를 일단 컴파일되게 처리함.
  - hardhat.config.ts에 `import "hardhat-deploy"` 추가하니까 컴파일 잘 됨.
  - ethers와 hardhat과 "@typechain/ethers-v5"관계 정리 필요.

#### Feb 5, 2024 
- scripts/deploy-lock-with-factory.ts에 Create2Factory 이용한 Lock 생성 코드 작업 시작
  - hardhat node를 로컬에 실행시켜서 진행함.