# Work-Env
[karabiner](#karabiner)
[.gitconfig](#gitconfig)

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

### karanbiner 및 기타 파일
- iterm2 - Preferences - Profiles - Silence bell
- [gitconfig html](sub/gitconfig.htmlml) 내용은 .gitconfig에 복사 & `git init`
- iCloud/pooh 폴더 복사해 놓기.

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

### google gemini
use nvm 20
npm install -g @google/gemini-cli
gemini

### claude
https://claude.ai/download
npm install -g @anthropic-ai/claude-code
claude

Quick start:
│ • Press Cmd+Esc to launch Claude Code
│ • View and apply file diffs directly in your editor
│ • Use Cmd+Option+K to insert @File references

### codex cli
brew install codex
codex login
codex
$ /model
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

😈 Calendar 추가(Dev Team)
😈 스타일가이드: https://github.com/bpfkorea/agora/blob/v0.x.x/doc/Style.md, 상세한 설명 필요

## karabiner
{
    "global": {
        "ask_for_confirmation_before_quitting": true,
        "check_for_updates_on_startup": true,
        "show_in_menu_bar": true,
        "show_profile_name_in_menu_bar": false,
        "unsafe_ui": false
    },
    "profiles": [
        {
            "complex_modifications": {
                "parameters": {
                    "basic.simultaneous_threshold_milliseconds": 50,
                    "basic.to_delayed_action_delay_milliseconds": 500,
                    "basic.to_if_alone_timeout_milliseconds": 1000,
                    "basic.to_if_held_down_threshold_milliseconds": 500,
                    "mouse_motion_to_scroll.speed": 100
                },
                "rules": [
                    {
                        "description": "Mouse full emulation with right command super fast",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "right_command",
                                    "modifiers": {
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "right_command"
                                    }
                                ],
                                "to_after_key_up": [
                                    {
                                        "set_variable": {
                                            "name": "mouse_keys_full",
                                            "value": 1
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    },
                                    {
                                        "name": "mouse_keys_full_scroll",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "h",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "horizontal_wheel": 32
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    },
                                    {
                                        "name": "mouse_keys_full_scroll",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "j",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "vertical_wheel": 32
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    },
                                    {
                                        "name": "mouse_keys_full_scroll",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "k",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "vertical_wheel": -32
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    },
                                    {
                                        "name": "mouse_keys_full_scroll",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "l",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "horizontal_wheel": -32
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "h",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "x": -1536
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "j",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "y": 1536
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "k",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "y": -1536
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "l",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "x": 1536
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "v",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "pointing_button": "button1"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "b",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "pointing_button": "button3"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "r",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "pointing_button": "button2"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "f",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "speed_multiplier": 2.0
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "d",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "mouse_key": {
                                            "speed_multiplier": 0.3
                                        }
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "conditions": [
                                    {
                                        "name": "mouse_keys_full",
                                        "type": "variable_if",
                                        "value": 1
                                    }
                                ],
                                "from": {
                                    "key_code": "s",
                                    "modifiers": {
                                        "mandatory": [
                                            "right_command"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "set_variable": {
                                            "name": "mouse_keys_full_scroll",
                                            "value": 1
                                        }
                                    }
                                ],
                                "to_after_key_up": [
                                    {
                                        "set_variable": {
                                            "name": "mouse_keys_full_scroll",
                                            "value": 0
                                        }
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    },
                    {
                        "description": "Screenshot to Backspace",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "4",
                                    "modifiers": {
                                        "mandatory": [
                                            "left_command",
                                            "left_shift"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "delete_or_backspace"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    },
                    {
                        "description": "Disable Page Up and Page Down",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "page_up"
                                },
                                "to": [
                                    {
                                        "key_code": "vk_none"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "page_down"
                                },
                                "to": [
                                    {
                                        "key_code": "vk_none"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    },
                    {
                        "description": "Change Option + h/j/k/l to Arrows",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "h",
                                    "modifiers": {
                                        "mandatory": [
                                            "option"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "left_arrow"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "j",
                                    "modifiers": {
                                        "mandatory": [
                                            "option"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "down_arrow"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "k",
                                    "modifiers": {
                                        "mandatory": [
                                            "option"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "up_arrow"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "l",
                                    "modifiers": {
                                        "mandatory": [
                                            "option"
                                        ],
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "right_arrow"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "h",
                                    "modifiers": {
                                        "mandatory": [
                                            "control"
                                        ],
                                        "optional": [
                                            "caps_lock",
                                            "option"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "delete_or_backspace"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    }
                ]
            },
            "devices": [
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": true,
                        "is_pointing_device": false,
                        "product_id": 832,
                        "vendor_id": 1452
                    },
                    "ignore": false,
                    "manipulate_caps_lock_led": true,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": false,
                        "is_pointing_device": true,
                        "product_id": 832,
                        "vendor_id": 1452
                    },
                    "ignore": true,
                    "manipulate_caps_lock_led": false,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": true,
                        "is_pointing_device": true,
                        "product_id": 591,
                        "vendor_id": 1452
                    },
                    "ignore": true,
                    "manipulate_caps_lock_led": true,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": true,
                        "is_pointing_device": false,
                        "product_id": 591,
                        "vendor_id": 1452
                    },
                    "ignore": false,
                    "manipulate_caps_lock_led": true,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": false,
                        "is_pointing_device": true,
                        "product_id": 613,
                        "vendor_id": 76
                    },
                    "ignore": true,
                    "manipulate_caps_lock_led": false,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": true,
                        "is_pointing_device": false,
                        "product_id": 34304,
                        "vendor_id": 1452
                    },
                    "ignore": false,
                    "manipulate_caps_lock_led": true,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                },
                {
                    "disable_built_in_keyboard_if_exists": false,
                    "fn_function_keys": [],
                    "game_pad_swap_sticks": false,
                    "identifiers": {
                        "is_game_pad": false,
                        "is_keyboard": false,
                        "is_pointing_device": true,
                        "product_id": 617,
                        "vendor_id": 76
                    },
                    "ignore": true,
                    "manipulate_caps_lock_led": false,
                    "mouse_flip_horizontal_wheel": false,
                    "mouse_flip_vertical_wheel": false,
                    "mouse_flip_x": false,
                    "mouse_flip_y": false,
                    "mouse_swap_wheels": false,
                    "mouse_swap_xy": false,
                    "simple_modifications": [],
                    "treat_as_built_in_keyboard": false
                }
            ],
            "fn_function_keys": [
                {
                    "from": {
                        "key_code": "f1"
                    },
                    "to": [
                        {
                            "consumer_key_code": "display_brightness_decrement"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f2"
                    },
                    "to": [
                        {
                            "consumer_key_code": "display_brightness_increment"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f3"
                    },
                    "to": [
                        {
                            "apple_vendor_keyboard_key_code": "mission_control"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f4"
                    },
                    "to": [
                        {
                            "apple_vendor_keyboard_key_code": "spotlight"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f5"
                    },
                    "to": [
                        {
                            "consumer_key_code": "dictation"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f6"
                    },
                    "to": [
                        {
                            "key_code": "f6"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f7"
                    },
                    "to": [
                        {
                            "consumer_key_code": "rewind"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f8"
                    },
                    "to": [
                        {
                            "consumer_key_code": "play_or_pause"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f9"
                    },
                    "to": [
                        {
                            "consumer_key_code": "fast_forward"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f10"
                    },
                    "to": [
                        {
                            "consumer_key_code": "mute"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f11"
                    },
                    "to": [
                        {
                            "consumer_key_code": "volume_decrement"
                        }
                    ]
                },
                {
                    "from": {
                        "key_code": "f12"
                    },
                    "to": [
                        {
                            "consumer_key_code": "volume_increment"
                        }
                    ]
                }
            ],
            "name": "Default profile",
            "parameters": {
                "delay_milliseconds_before_open_device": 1000
            },
            "selected": true,
            "simple_modifications": [],
            "virtual_hid_keyboard": {
                "country_code": 0,
                "indicate_sticky_modifier_keys_state": true,
                "mouse_key_xy_scale": 100
            }
        }
    ]
}


## gitconfig
[user]
	email = linked0@gmail.com
	name = Hyunjae Lee
[core]
	excludesfile = /Users/jaylee/.gitignore_global
[difftool "sourcetree"]
	cmd = opendiff \"$LOCAL\" \"$REMOTE\"
	path = 
[mergetool "sourcetree"]
	cmd = /Applications/Sourcetree.app/Contents/Resources/opendiff-w.sh \"$LOCAL\" \"$REMOTE\" -ancestor \"$BASE\" -merge \"$MERGED\"
	trustExitCode = true
[commit]
	template = /Users/jaylee/.stCommitMsg
[alias]
	co = checkout
	lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%\
Creset' --abbrev-commit
	pff = "!f() { REMOTE=$(git remote|grep -E '^upstream$'); git pull --ff-only ${REMOTE:-origin} $(git rev-parse --s\
ymbolic-full-name HEAD); }; f"
	rb  = "!f() { git rebase -i HEAD~$1; }; f"
	ru  = "remote update -p"
	br = branch
	ci = commit
	unstage = reset HEAD --
	st = status
	recentb = for-each-ref --sort=-committerdate refs/heads/ --format='%(HEAD) %(align:20)(%(color:green)%(committerdate:relative)%(color:reset))%(end) %(align:30)%(color:yellow)%(refname:short)%(color:reset)%(end) - %(color:red)%(object\
name:short)%(color:reset) - %(contents:subject)'
	cmp = "!f() { git add -A && git commit -m \"$@\" && git push; }; f"
	acp = "! git commit -a -m "commit" && git push"
[push]
	default = current
[pager]
    diff = delta
    log = delta
    reflog = delta
    show = delta
[delta]
    plus-style = "syntax #012800"
    minus-style = "syntax #340001"
    syntax-theme = Solarized (light)
    navigate = true
    line-numbers = true
[interactive]
    diffFilter = delta --color-only