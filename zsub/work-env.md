## Work/Dev
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※
### Mac Setting
##### .ssh 복사
iCloud/pooh/ssh.tar

##### xcode command/brew/zsh/iterm2/karabiner install
```
xcode-select —-install
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install --cask iterm2 | brew install zsh | brew install karabiner-elements
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

##### karanbiner 및 기타 파일
- iterm2 - Preferences - Profiles - Silence bell
- [gitconfig html](sub/gitconfig.htmlml) 내용은 .gitconfig에 복사 & `git init`
- iCloud/pooh 폴더 복사해 놓기.

##### awscli 설치 및 aws configure

[aws cli](https://awscli.amazonaws.com/AWSCLIV2.pkg)

```
$ aws configure
AWS Access Key ID: 맥 메모에 있음
AWS Secret Access Key : 맥 메모에 있음.
Default region name [None]: ap-northeast-2
Default output format [None]:
```

echo $SHELL로 쉘 확인하고 아래 .zshrc에 복사
```
`단축키` 부분으로 이동
```
.zshrc에 테마 찾아서 복사
```
ZSH_THEME="robbyrussell"
```

finder 열고 다음 실행하면 숨김 파일 보임
```
Command + Shift + .
```

##### chatgpt-cli
```
brew tap kardolus/chatgpt-cli && brew install chatgpt-cli
```
Set the OPENAI_API_KEY environment variable to your [ChatGPT secret key](https://platform.openai.com/account/api-keys). To set the environment variable, you can add the following line to your shell profile (e.g., ~/.bashrc, ~/.zshrc, or ~/.bash_profile), replacing your_api_key with your actual key:
```
export OPENAI_API_KEY="your_api_key"
```

To enable history tracking across CLI calls
```
mkdir -p ~/.chatgpt-cli
```

To start interactive mode, use the -i or --interactive flag:
```
chatgpt --interactive
```

To use the pipe feature, create a text file containing some context.
Then, use the pipe feature to provide this context to ChatGPT:
```
cat context.txt | chatgpt "What kind of toy would Kya enjoy?"
```

And run this
```
chatgpt what is the capital of the Netherlands
```

List the models
```
chatgpt --list-models
```

Set a model
```
chatgpt --set-model gpt-4-turbo-2024-04-09
```

##### npm yarn docker install
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
npm install -g yarn
brew install cask docker
brew install cask docker-compose
```
##### nvm install
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.nvm/nvm.sh
```

https://www.docker.com/products/docker-desktop/ 도커 Desktop (linked0/**)

##### rust/postgresql install
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

##### MySql Server 설치
- https://dev.mysql.com/downloads/mysql/ 이동
- 버전에 맞게 ARM이나 X86 버전 설치 
- 예) macOS 14 (ARM, 64-bit), DMG Archive 이나 macOS 14 (x86, 64-bit), DMG Archive
- MySQL Workbench도 설치
- 초기화: 시스템 메뉴 -> 설정 -> 왼쪽 하단의 MySQL 클릭해서 들어가서 "Initialize Database" 클릭
- 암호는 alfred0!@

##### Whale, Miro, onenote, Visual Studio, Xcode, Github CLI, IDEA
- Command Palette: [⇧⌘P ] Shell command
- Settings 열기: cmd + ,
- XCode: [Apple Developer](https://developer.apple.com/xcode/resources/)
- FileMerge: open /Applications/Xcode.app/Contents/Applications/FileMerge.app
- brew install gh
- Idea 명령세팅: export PATH=$PATH:'/Applications/IntelliJ IDEA.app/Contents/MacOS'
- Idea Cyan Light Theme 설치

##### VS Code Plugin
- Solidity Visual Developer
- Solidity(JuanBlanco)
- Go/rust-analyzer
- Live Preview
- Github Copilot
- Markdown All in One
- Github actions
- Extension Pack for Java


##### VS Code Setting
- 느린 스크롤 세팅: Settings 열기 - terminal smo 검색 - Smooth Scrolling 체크
- VS Code 세팅: Editor: Hover Enable을 Disable로 바꿔야 코드창에서 팝업 안뜸
- tabstob 바꾸기
Open settings(cmd + shift + p => settings) => 다음 코드 추가 및 재실행
```
"[typescript]": {
        "editor.tabSize": 2,
        "editor.insertSpaces": true // true if you prefer spaces over tabs
    },
    "[solidity]": {
        "editor.tabSize": 2, // or the number you prefer for Solidity
        "editor.insertSpaces": true // true if you prefer spaces over tabs
    },
```
##### hardhat & foundry
###### hardhat 
- npm install --global yarn 
- yarn global add hardhat 

###### foundry 
- curl -L https://foundry.paradigm.xyz | bash

##### 기타
- 🔥 memo.txt를 사용하기 보다는 그냥 스티커 앱 사용
- 맥 메인 모니터 설정 및 Dock 사이즈 조정
- 데스크탑 및 Dock: Mission Control - Spaces를 최근 사용내역에 따라 자동으로 재정렬
- 휴지통 컵
- .gitignore: broadcast 폴더 전부 제거할 때
```
/broadcast/*
```

------
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

😈 Calendar 추가(Dev Team)
😈 스타일가이드: https://github.com/bpfkorea/agora/blob/v0.x.x/doc/Style.md, 상세한 설명 필요