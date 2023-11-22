
Table of Contents
- [IDE](#ide)
    - [Mac](#mac)
    - [VSCode](#vscode)
    - [Iterm2](#iterm2)
    - [VIM](#vim)
    - [Command](#command)
    - [Finder](#finder)
- [Dev](#dev)
    - [create2](#create2-함수)
    - [clique](#clique-in-genesisjson)
    - [nodejs workspaces](#node-workspaces)
    - [Typescript](#typsscriptnodejs)
    - [Solidity](#solidiy)
    - [Docker/NPM/AWS](#dockernpmaws)
    - [python](#python)
    - [rust](#rust)
    - [Foundry](#foundry)
- [Projects](#projects)
    - [zksync](#zksync)
    - [poohnet](#poohnet)
        - [EL/CL](#elcl)

# IDE
## Mac
##### 1) .ssh 복사
##### 2) brew/zsh/iterm2/karabiner install
```
xcode-select —-install | /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install --cask iterm2 | brew install zsh | brew install karabiner-elements
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

echo $SHELL <== 이걸로 쉘 확인

karabiner는 option+hjkl가 디폴트로 있음.

##### 3) npm yarn docker install
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
npm install -g yarn
brew install cask docker
brew install cask docker-compose
```
https://www.docker.com/products/docker-desktop/ 도커 Desktop (linked0/**)

##### 4) rust/postgresql install
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install sqlx-cli
```
```
brew update
brew install postgresql
brew services start postgresql
```
psql postgres <== 접속해볼 수 있음.

##### 5) Whale, Miro, onenote, Visual Studio
Command Palette 를 열어줍니다. [⇧⌘P ] Shell command

##  VSCode
Command Palette 를 열어줍니다. [⇧⌘P ] Shell command
back: ctrl - , forward: shift ctrl -

- ctrl tab: recent files
- shift cmd n - cmd shift /: open project
- ctrl `: goto terminal
- Cmd+Shift+]: Move to previous terminal
- Cmd+shift+[: Move to next terminal
= ctrl shift ₩ : new terminal

Bigger Font: cmd + "+"

## Iterm2
Next split: cmd + ]

## VIM
find . -type f -not -path .*/node_modules/* -not -path .*/.git/* -not -path .*/venv/* > files
open file: ctrl w, ctrl f

## Command
egrep -irnH --include=\*.cpp --exclude-dir=.svn 'beacon.pntbiz.com' ./
tar --exclude='node_modules' -cvzf bccard.tar.gz bccard
tar -xvzf xxx.tar.gz -C ./data

여러 sub directory에 node_modules를 제거함.
tar --exclude='*/node_modules' --exclude='.git' -cvzf ~/temp/pooh-tools.tar.gz .
opt cmd b - Bookmark

ssh-keygen -t rsa

screen -X -S session_id quit
- ctrl a+d // exit
- screen -S el -X quit
- screen -r -d 17288 <-- attatch되어 있는 것 detach

brew install golang
`PATH=$PATH:$HOME/go/bin`
go install github.com/protolambda/zcli@latest
zcli --help
alias nd1="ssh -i ~/pooh/tednet.pem ubuntu@13.209.149.243"

하위 동일 폴더 지우기
find . -type d -name 'temp' -exec rm -rf {} +

## Finder
= hidden files: Command + Shift + . (period key)

--------

# Dev
## create2 함수
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


## clique in genesis.json
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

## Node workspaces
##### Structure and Configuration
- Workspace Root: A single workspace has a root directory, usually with a package.json file that includes a workspaces field.
- Sub-packages: Inside the root, there are subdirectories for each workspace, each with its own package.json file.
- Shared Configuration: Dependencies and scripts can be shared across workspaces, which is especially useful for common configurations and shared libraries.

###### Reference Project
- [poohgithub zksync-era](https://github.com/poohgithub/zksync-era)
- [mater-labs pymaster-examples](https://github.com/matter-labs/paymaster-examples)

## TypsScript/Nodejs

##### NodeJs 프로젝트
- npm init -y
- touch index.js

##### TypeScript 프로젝트
- npm install -g typescript
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

###### yarn
yarn add --dev 

## Hardhat / solidity
Hardhat은 기존 프로젝트에서는 안됨.
yarn init -y (=npm init -y)
yarn add --dev hardhat
npx hardhat

yarn add @openzeppelin/contracts

아래 두개는 같이 쓰면 안됨.
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle"; // 이것만써.

yarn add dotenv
alchemy keyless 설명에 alchemy web3 설치방법.

yarn hardhat node (chain id: 31337)
yarn hardhat run ./scripts/send-raw-tx.ts --network hardhat

--------
##### solidiy
import "hardhat/console.sol";
npx hardhat compile

const tx = await factoryInstance.setFeeTo(process.env.FEE_TO);
const receipt = await (await tx).wait();


## docker/npm/aws
##### docker
- docker attach

- docker ps | grep 5432

- 파일의 권한도 github으로 등록된다. run_node 실행권한

- To restore the entire staging area to the HEAD commit, you can run the following command:
git restore --staged .

- 수호는 블록체인 생태계를 활성화하고 연결하기 위하여 Bridge, DEX와 같은 Dapp 프로덕트를 개발하고 있습니다.

##### npm
npm login
npm publish --access public


## EL/CL
##### geth compile
brew install golang
go run build/ci.go install -static ./cmd/geth or make geth
sudo cp ./build/bin/geth /usr/local/bin/geth

##### EL
- ./init local 1 & ./enode pow el1
- ./init pow 1 & ./enode pow el1
- ./init pow 2 & ./enode pow el2

##### CL
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


## python
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

==> setup.py를 이용하는 것도 필요.
from setuptools import find_packages, setup
setup(
    name="staking_deposit",
    version='2.5.2',
    py_modules=["staking_deposit"],
    packages=find_packages(exclude=('tests', 'docs')),
    python_requires=">=3.8,<4",
)
python ./staking_deposit/deposit.py "$@"를 사용가능.

다 끝나면 deactivate

##### colab
import matplotlib.pyplot as plt

##### VS Code
- Open the Command Palette (⇧⌘P), start typing the Python: Create Environment
- 다른 프로젝트(예: poohcode)의 하위 프로젝트라면 .venv 폴더 복사
- source ./venv/bin/activate
- 수동으로 하는 방법: python3 -m venv venv39
- pip3 freeze > requirements.txt <== venv를 빠져나오고 해야함.
- python hello.py

## Rust
Homebrew rust와 rustup로 설치된 것과 연동안됨. 따라서 아래와 같이 지우기
brew uninstall rust

그리고 rustc 이용
rustup install nightly-2023-07-21
rustup default nightly-2023-07-21

--------

# Project
## poohnet
###### el/cl

## zksync
local-setup에서 clear-sql.sh와 start-sql.sh
localentry.sh 실행
greeter-example에서 deploy-test와 greet-test진행

## Foundry