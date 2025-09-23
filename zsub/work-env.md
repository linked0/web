# Work-Env
[karabiner](./karabiner.json)
[.gitconfig](./gitconfig)

## Mac Setting
### .ssh 복사
iCloud/pooh/ssh.tar

#### xcode command/brew/zsh/iterm2/karabiner install
```
xcode-select —-install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install --cask iterm2 | brew install zsh | brew install karabiner-elements
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### karanbiner/iterm2/git 및 기타 파일
- [karabiner](./karabiner.json)
- iterm2 - Preferences - Profiles - Silence bell
  - Settings - Profiles - Default - Colors - Color Preset: Tango Light
    - Minimum Contract: 33
- [.gitconfig](./gitconfig) 내용은 .gitconfig에 복사 & `git init`
- iCloud/pooh 폴더 복사해 놓기.
- brew install gh
- right command to 한영전환
  - karabinder에서 add rule, right command를 F19로 세팅
  - system setting에서 입력소스 단축키에 right command 입력하면 F19 입력됨.
  - 그리고, CapsLock으로 한영전환하는 것은 제거하기
- 키크론 스크린샷 키 비활성화
  - Under "System Settings" --> "Keyboard" --> "Keyboard Shortcuts" --> "Screenshots" --> "Cmd Shift 4", disable

### gpt shortcut

#### 설정 방법
- Automator
  - "ActionScript 실행"
  - Add script and save
- Keyboard shortcut
  - Settings -> 키보드 -> 키보드 단축키 -> 서비스 -> 일반
- 보안 세팅
  - Settings -> 개인정보 보호 및 보안 -> 손쉬운 사용
    - automator, safari에 대해서 허용

#### Apple Scripts
- gpt1: shift cmd x
```
tell application "System Events"
  keystroke ": show me corrected version for my english, and answer my message in detail"
	key code 36 -- Presses "Enter" (Return key)
end tell
```

- gpt2: shift cmd ,
```
tell application "System Events"
  keystroke ": create sentence with this text"
	key code 36 -- Presses "Enter" (Return key)
end tell
```

- gpt3: shift cmd '
```
tell application "System Events"
  keystroke ": translate into korean and explain in english"
	key code 36 -- Presses "Enter" (Return key)
end tell
```

- gpt4: shift cmd \
```
tell application "System Events"
  keystroke ": summarize this in brief"
	key code 36 -- Presses "Enter" (Return key)
end tell
```

- gpt5: shift cmd p
```
tell application "System Events"
  keystroke ": translate into english and answer in english"
	key code 36 -- Presses "Enter" (Return key)
end tell
```

- Settings -> 개인정보 보호 및 보안 -> 손쉬운 사용에서 허용으로 바꿔야 해당앱에서 단축키 사용가능

### Warp/GitKraken/Slack
https://www.gitkraken.com/
https://www.warp.dev/
[Slack on AppStore](https://apps.apple.com/us/app/slack-for-desktop/id803453959?mt=12&ls=1)

### awscli 설치 및 aws configure
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

### node version
이걸 해야 매번 nvm use 20을 안해도 됨
```
export PATH="/path/to/node-v20.19.0/bin:$PATH"
```

### gemini & codex
use nvm 20
brew install gemini
gemini

.zshrc 세팅
- OPENAI_API_KEY
- GEMINI_API_KEY

[gemini settings.json](./settings.json)

### chatgpt-cli
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
chatgpt --set-model o1-mini
```

### npm yarn docker install
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
npm install -g yarn
brew install cask docker
brew install cask docker-compose
```
### nvm install
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source ~/.nvm/nvm.sh

https://www.docker.com/products/docker-desktop/ 도커 Desktop (linked0/**)

### rust/postgresql install
> pip3 install git+https://github.com/elyase/ethers-py --break-system-packages

> curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
export PATH="$HOME/.cargo/bin:$PATH"
cargo install sqlx-cli

> brew update
brew install postgresql
brew services start postgresql

psql postgres <== 접속해볼 수 있음.

### MySql Server 설치
- https://dev.mysql.com/downloads/mysql/ 이동
- 버전에 맞게 ARM이나 X86 버전 설치 
- 예) macOS 14 (ARM, 64-bit), DMG Archive 이나 macOS 14 (x86, 64-bit), DMG Archive
- MySQL Workbench도 설치
- 초기화: 시스템 메뉴 -> 설정 -> 왼쪽 하단의 MySQL 클릭해서 들어가서 "Initialize Database" 클릭
- 암호는 alfred0!@

### Posgresql Server 설치
- pgadmin download(https://www.pgadmin.org/download/pgadmin-4-macos/)

### Whale, Miro, onenote, Visual Studio, Xcode, Github CLI, IDEA
- Whale extension: React Developer Tools
- Command Palette: [⇧⌘P ] Shell command
- Settings 열기: cmd + ,
- XCode: [Apple Developer](https://developer.apple.com/xcode/resources/)
- FileMerge: open /Applications/Xcode.app/Contents/Applications/FileMerge.app
- brew install gh
- Idea 명령세팅: export PATH=$PATH:'/Applications/IntelliJ IDEA.app/Contents/MacOS'
- Idea Cyan Light Theme 설치

### ETC
- Postman Agent: 이거 쓰지 말고 curl쓰는 방식으로 그냥 ChatGPT에게 물어보면 됨.
- Whiteboard (AppStore에 있음)

### VS Code Plugin
- Solidity Visual Developer
- Solidity(JuanBlanco)
- Go/rust-analyzer
- Live Preview
- Github Copilot
- Markdown All in One
- Github actions
- Extension Pack for Java
- Prettier - Code formatter
- ES7+ React/Redux/React-Native
- vscode-pdf
- Cairo 1.0 (with r) & Cairo Syntax
- Solidity Visual Developer: audit tag를 위해서 사용될 수 있음, @audit-ok ⇐ 오딧 관련 코멘트
- Inline Bookmarks
- CodeRabbit
- Gemini Code Assist

### VS Code Setting
- 느린 스크롤 세팅: Settings 열기 - smoothScrolling 검색 - Smooth Scrolling 체크
- VS Code 세팅: Editor: Hover Enable을 Disable로 바꿔야 코드창에서 팝업 안뜸
- tabstob 바꾸기
  - Open settings(cmd + shift + p에서 "Open Settings" 입력) => Intent Size 검색
  - 맨 밑에서 "Edit in setting.json" 링크 클릭 
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
- terminal buffer 늘리기
  - cmd + shift + p => scrollback
  - 1000을 100000으로 늘려줌
- shortcut 수정
  - Toogle Panel Visibility: cmd ctrl j
  - Toggle Terminal : cmd j

### How to Show the .git Folder in VS Code
- Open VS Code Settings: Press (Cmd + ,) to open the Settings UI.
- Open Settings as JSON 📄: Type "files.exclude"
- Modify the files.exclude Setting 

### hardhat & foundry
#### hardhat 
- npm install --global yarn 
- yarn global add hardhat 

#### foundry 
```shell
curl -L https://foundry.paradigm.xyz | bash
source /Users/jay/.zshenv
brew install libusb
brew link libusb
source ~/.zshrc
foundryup
forge --version
```

### 기타
- CAPS 키 지연 문제
```
hidutil property --set '{"CapsLockDelayOverride":10}'
```
- 🔥 memo.txt를 사용하기 보다는 그냥 스티커 앱 사용
- 맥 메인 모니터 설정 및 Dock 사이즈 조정
- 데스크탑 및 Dock: Mission Control - Spaces를 최근 사용내역에 따라 자동으로 재정렬
- 휴지통 컵
- .gitignore: broadcast 폴더 전부 제거할 때
```
/broadcast/*
```
- m.txt를 한번 띄우고, 다음에 cmd space로 찾기 쉽게 만들기.

😈 Calendar 추가(Dev Team)
😈 스타일가이드: https://github.com/bpfkorea/agora/blob/v0.x.x/doc/Style.md, 상세한 설명 필요

