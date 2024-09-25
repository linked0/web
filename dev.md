# Jay's Dev Information
🌟🏓🦋⚾️🥎🏐🐳🍀🌼🌸🏆🍜😈🐹🦁🌟🔹♦️⚡️💥🌈🔥⚾️🐶🦄☕️🚘🔴

- [dev.md text](bit.ly/3MT0VRb)
- [dev.md]([bit.ly/3MVG5AN)
- [site summary](https://bit.ly/2PmH3XE)

# # 0. Work-Summary


# # 1. Code/Error

#### $ hardhat run --network localnet script/deploy.ts
ProviderError: method handler crashed
    at HttpProvider.request (/Users/jay/work/pooh-land-contract/node_modules/hardhat/src/internal/core/providers/http.ts:107:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async EthersProviderWrapper.send (/Users/jay/work/pooh-land-contract/node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
error Command failed with exit code 1.

==>

#### error This project's package.json defines "packageManager": "yarn@4.4.1". However the current global version of Yarn is 1.22.22.

Presence of the "packageManager" field indicates that the project is meant to be used with Corepack, a tool included by default with all official Node.js distributions starting from 16.9 and 14.19.
Corepack must currently be enabled by running corepack enable in your terminal. For more information, check out https://yarnpkg.com/corepack.

==>
```
brew install corepack
corepack enable
brew unlink yarn
corepack prepare yarn@4.1.1 --activate
```

#### Cannot connect to the Docker daemon at unix:///Users/hyunjaelee/.docker/run/docker.sock. Is the docker daemon running?

==> docker가 실행중이지 않음. 데스크탑 실행 필요. 업데이트 중일수 있음.

#### 단위 테스트에서는 에러가 안나는데 전체 테스트 (yarn test)에서는 에러남
에러 안남 => "sensitive2": "hardhat test test/4-sensitive-on-chain-data-2.ts",
에러 남 => yarn test 
1) Sensitive On-Chain Data Exercise 2
   "after all" hook for "Exploit":
   Error: could not decode result data (value="0x", info={ "method": "isLocked", "signature": "isLocked()" }, code=BAD_DATA, version=6.13.2)
   at makeError (node_modules/ethers/src.ts/utils/errors.ts:694:21)
   at assert (node_modules/ethers/src.ts/utils/errors.ts:715:25)
   at Interface.decodeFunctionResult (node_modules/ethers/src.ts/abi/interface.ts:916:15)
   at staticCallResult (node_modules/ethers/src.ts/contract/contract.ts:346:35)
   at async staticCall (node_modules/ethers/src.ts/contract/contract.ts:303:24)
   at async Proxy.isLocked (node_modules/ethers/src.ts/contract/contract.ts:351:41)
   at async Context.<anonymous> (test/4-sensitive-on-chain-data-2.ts:59:44)

==> 테스트 순서를 바꾸니 해결됨.
파일 명을 0-sensitive-on-chain-data-2.ts로 수정

#### 
Forking Mainnet Block Height 15969633, Manual Mining Mode with interval of 10 seconds
Error HH8: There's one or more errors in your config file:

  * Invalid value {"mining":{"auto":false,"interval":10000},"forking":{"blockNumber":15969633}} for HardhatConfig.networks.hardhat - Expected a value of type HardhatNetworkConfig.

To learn more about Hardhat's configuration, please go to https://hardhat.org/config/

==> hardhat.config.ts(혹은 js)에서 process.env.MAINNET을 찾는데, .env에 MAINNET_URL로 되어 있어서 에러남.

#### Your branch is ahead of 'origin/pos' by 1 commit.
(use "git push" to publish your local commits)

hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge (the default strategy)
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.

==>
git pull
git reset --hard origin/set-cl-node

#### remove python3.9 on ubuntu
sudo apt-get remove python3.9

#### ubuntu@ip-172-31-22-252:~$ git clone git@github.com:linked0/poohgeth
Cloning into 'poohgeth'...
The authenticity of host 'github.com (20.200.245.247)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

* ==> ssh.tar를 풀었는데, .ssh/.ssh에 풀리는 문제 발생 아래와 같이 불필요하게 -C옵션 씀
* tar -xvzf ssh.tar -C .ssh

# 기타
### EC2 key로 ssh접속 Permission Denied (public key) 
pooh-seoul.pem를 써야하는데 tednet.pem을 씀.

# solidity.md

## NodeJS/TypeScript

### Event 인자들중 하나만 체크
```
await expect(lock.withdraw())
    .to.emit(lock, "Withdrawal")
    .withArgs(lockedAmount, anyValue);
```
위 코드를 아래와 같이 변경. anyValue가 제대로 동작 안함.
```
const tx = await lock.withdraw();
const receipt = await tx.wait();
// Find the Withdrawal event in the transaction receipt
const withdrawalEvent = receipt.events.find((e: any) => e.event === "Withdrawal");

// Check if the Withdrawal event was emitted
expect(withdrawalEvent, "Withdrawal event should be emitted").to.not.be.undefined;

// Check only the first argument of the Withdrawal event
expect(withdrawalEvent.args[0]).to.equal(lockedAmount);
```

---
### anyValue function
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
wait expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  :error occured like this, 
AssertionError: Expected 1732243098 to equal function anyValue() {
    return true;
}, but they have different lengths

---
### an issue with fsevents
```
warning Error running install script for optional dependency: "/Users/hyunjaelee/node_modules/@remix-project/remixd/node_modules/fsevents: Command failed.
Exit code: 1
Command: node install.js
Arguments: 
Directory: /Users/hyunjaelee/node_modules/@remix-project/remixd/node_modules/fsevents
Output:
node:events:491
      throw er; // Unhandled 'error' event
      ^

Error: spawn node-gyp ENOENT
    at Process.ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:485:16)
    at processTicksAndRejections (node:internal/process/task_queues:83:21)
Emitted 'error' event on ChildProcess instance at:
    at Process.ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:485:16)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'spawn node-gyp',
success Saved lockfile.
warning No license field
success Saved 568 new dependencies.
```

🏆 해결
1. Add this to your package.json file, then re-run yarn (or yarn install):
"resolutions": {
  "fsevents": "1.2.9"
}
2. 이렇게 하면 node-gyp가 설치됨
3. 그러고나서 위의 resolutions 부분을 제거하고 다시 yarn을 실행해서 fsevents를 최선으로 재설치
4. 안 그러면 "Typeerror: fsevents.watch is not a function" 발생할 수 있음.


---
### 로컬 링크 만들기
	- yarn add /Users/hyunjaelee/work/hardhat-zksync/packages/hardhat-zksync-deploy

---
### npm module upgrade
yarn upgrade hardhat-change-network

---
### NPM publish 에러
```
npm notice Publishing to https://registry.npmjs.org/
This operation requires a one-time password.
Enter OTP: 978999
npm ERR! code E402
npm ERR! 402 Payment Required - PUT https://registry.npmjs.org/@poohnet%2fpooh-swap-v2-core - You must sign up for private packages

npm ERR! A complete log of this run can be found in:
```
🏆 해결
npm public --access public을 사용해야 함.

### /bin/sh: python: command not found
```
gyp info spawn args [ 'BUILDTYPE=Release', '-C', 'build' ]
  ACTION deps_sqlite3_gyp_action_before_build_target_unpack_sqlite_dep Release/obj/gen/sqlite-autoconf-3310100/sqlite3.c
/bin/sh: python: command not found
make: *** [Release/obj/gen/sqlite-autoconf-3310100/sqlite3.c] Error 127
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:201:23)
gyp ERR! stack     at ChildProcess.emit (node:events:513:28)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (node:internal/child_process:293:12)
gyp ERR! System Darwin 23.0.0
gyp ERR! command \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node\" \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js\" \"build\" \"--fallback-to-build\" \"--module=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64/node_sqlite3.node\" \"--module_name=node_sqlite3\" \"--module_path=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64\" \"--napi_version=8\" \"--node_abi_napi=napi\" \"--napi_build_version=0\" \"--node_napi_label=node-v93\"
gyp ERR! cwd /Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3
gyp ERR! node -v v16.20.2
gyp ERR! node-gyp -v v9.1.0
gyp ERR! not ok 
node-pre-gyp ERR! build error 
node-pre-gyp ERR! stack Error: Failed to execute '/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node /Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js build --fallback-to-build --module=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64/node_sqlite3.node --module_name=node_sqlite3 --module_path=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64 --napi_version=8 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v93' (1)
node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (/Users/hyunjaelee/work/ondo-v1/node_modules/node-pre-gyp/lib/util/compile.js:83:29)
node-pre-gyp ERR! stack     at ChildProcess.emit (node:events:513:28)
node-pre-gyp ERR! stack     at maybeClose (node:internal/child_process:1100:16)
node-pre-gyp ERR! stack     at Process.ChildProcess._handle.onexit (node:internal/child_process:304:5)
node-pre-gyp ERR! System Darwin 23.0.0
node-pre-gyp ERR! command \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node\" \"/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/node_modules/.bin/node-pre-gyp\" \"install\" \"--fallback-to-build\"
node-pre-gyp ERR! cwd /Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3
node-pre-gyp ERR! node -v v16.20.2
node-pre-gyp ERR! node-pre-gyp -v v0.11.0
node-pre-gyp ERR! not ok 
✨  Done in 44.12s.
➜  ondo-v1 git:(main) rm -rf node_modules 
➜  ondo-v1 git:(main) yarn
yarn install v1.22.19
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
warning " > @nomiclabs/hardhat-waffle@2.0.1" has incorrect peer dependency "@nomiclabs/hardhat-ethers@^2.0.0".
warning " > @uniswap/sdk@3.0.3" has unmet peer dependency "@ethersproject/address@^5.0.0-beta".
warning " > @uniswap/sdk@3.0.3" has unmet peer dependency "@ethersproject/contracts@^5.0.0-beta".
warning " > @uniswap/sdk@3.0.3" has unmet peer dependency "@ethersproject/networks@^5.0.0-beta".
warning " > @uniswap/sdk@3.0.3" has unmet peer dependency "@ethersproject/providers@^5.0.0-beta".
warning " > @uniswap/sdk@3.0.3" has unmet peer dependency "@ethersproject/solidity@^5.0.0-beta".
warning "hardhat-gas-reporter > eth-gas-reporter@0.2.22" has unmet peer dependency "@codechecks/client@^0.1.0".
warning " > @typechain/ethers-v5@7.1.2" has unmet peer dependency "@ethersproject/bytes@^5.0.0".
warning " > @typechain/ethers-v5@7.1.2" has unmet peer dependency "@ethersproject/providers@^5.0.0".
warning " > @typechain/ethers-v5@7.1.2" has unmet peer dependency "@ethersproject/abi@^5.0.0".
warning " > hardhat-deploy@0.8.9" has unmet peer dependency "@ethersproject/hardware-wallets@^5.0.14".
warning "truffle > @truffle/db > jsondown@1.0.0" has unmet peer dependency "abstract-leveldown@*".
warning "truffle > @truffle/db > graphql-tools > @graphql-tools/links > apollo-upload-client@14.1.2" has unmet peer dependency "subscriptions-transport-ws@^0.9.0".
[4/4] 🔨  Building fresh packages...
[9/31] ⠠ keccak
[-/31] ⠠ waiting...
[19/31] ⠠ fsevents
[10/31] ⠠ secp256k1
warning Error running install script for optional dependency: "/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3: Command failed.
Exit code: 1
Command: node-pre-gyp install --fallback-to-build
Arguments: 
Directory: /Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3
Output:
node-pre-gyp info it worked if it ends with ok
node-pre-gyp info using node-pre-gyp@0.11.0
node-pre-gyp info using node@16.20.2 | darwin | x64
node-pre-gyp WARN Using request for node-pre-gyp https download 
node-pre-gyp info check checked for \"/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64/node_sqlite3.node\" (not found)
node-pre-gyp http GET https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v4.2.0/node-v93-darwin-x64.tar.gz
node-pre-gyp http 403 https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v4.2.0/node-v93-darwin-x64.tar.gz
node-pre-gyp WARN Tried to download(403): https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v4.2.0/node-v93-darwin-x64.tar.gz 
node-pre-gyp WARN Pre-built binaries not found for sqlite3@4.2.0 and node@16.20.2 (node-v93 ABI, unknown) (falling back to source compile with node-gyp) 
node-pre-gyp http 403 status code downloading tarball https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v4.2.0/node-v93-darwin-x64.tar.gz 
gyp info it worked if it ends with ok
gyp info using node-gyp@9.1.0
gyp info using node@16.20.2 | darwin | x64
gyp info ok 
gyp info it worked if it ends with ok
gyp info using node-gyp@9.1.0
gyp info using node@16.20.2 | darwin | x64
gyp info find Python using Python version 3.9.6 found at \"/Library/Developer/CommandLineTools/usr/bin/python3\"
gyp info spawn /Library/Developer/CommandLineTools/usr/bin/python3
gyp info spawn args [
gyp info spawn args   '/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/gyp/gyp_main.py',
gyp info spawn args   'binding.gyp',
gyp info spawn args   '-f',
gyp info spawn args   'make',
gyp info spawn args   '-I',
gyp info spawn args   '/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/build/config.gypi',
gyp info spawn args   '-I',
gyp info spawn args   '/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/addon.gypi',
gyp info spawn args   '-I',
gyp info spawn args   '/Users/hyunjaelee/Library/Caches/node-gyp/16.20.2/include/node/common.gypi',
gyp info spawn args   '-Dlibrary=shared_library',
gyp info spawn args   '-Dvisibility=default',
gyp info spawn args   '-Dnode_root_dir=/Users/hyunjaelee/Library/Caches/node-gyp/16.20.2',
gyp info spawn args   '-Dnode_gyp_dir=/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp',
gyp info spawn args   '-Dnode_lib_file=/Users/hyunjaelee/Library/Caches/node-gyp/16.20.2/<(target_arch)/node.lib',
gyp info spawn args   '-Dmodule_root_dir=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3',
gyp info spawn args   '-Dnode_engine=v8',
gyp info spawn args   '--depth=.',
gyp info spawn args   '--no-parallel',
gyp info spawn args   '--generator-output',
gyp info spawn args   'build',
gyp info spawn args   '-Goutput_dir=.'
gyp info spawn args ]
gyp info ok 
gyp info it worked if it ends with ok
gyp info using node-gyp@9.1.0
gyp info using node@16.20.2 | darwin | x64
gyp info spawn make
gyp info spawn args [ 'BUILDTYPE=Release', '-C', 'build' ]
  ACTION deps_sqlite3_gyp_action_before_build_target_unpack_sqlite_dep Release/obj/gen/sqlite-autoconf-3310100/sqlite3.c
/bin/sh: python: command not found
make: *** [Release/obj/gen/sqlite-autoconf-3310100/sqlite3.c] Error 127
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:201:23)
gyp ERR! stack     at ChildProcess.emit (node:events:513:28)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (node:internal/child_process:293:12)
gyp ERR! System Darwin 23.0.0
gyp ERR! command \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node\" \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js\" \"build\" \"--fallback-to-build\" \"--module=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64/node_sqlite3.node\" \"--module_name=node_sqlite3\" \"--module_path=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64\" \"--napi_version=8\" \"--node_abi_napi=napi\" \"--napi_build_version=0\" \"--node_napi_label=node-v93\"
gyp ERR! cwd /Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3
gyp ERR! node -v v16.20.2
gyp ERR! node-gyp -v v9.1.0
gyp ERR! not ok 
node-pre-gyp ERR! build error 
node-pre-gyp ERR! stack Error: Failed to execute '/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node /Users/hyunjaelee/.nvm/versions/node/v16.20.2/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js build --fallback-to-build --module=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64/node_sqlite3.node --module_name=node_sqlite3 --module_path=/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/lib/binding/node-v93-darwin-x64 --napi_version=8 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v93' (1)
node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (/Users/hyunjaelee/work/ondo-v1/node_modules/node-pre-gyp/lib/util/compile.js:83:29)
node-pre-gyp ERR! stack     at ChildProcess.emit (node:events:513:28)
node-pre-gyp ERR! stack     at maybeClose (node:internal/child_process:1100:16)
node-pre-gyp ERR! stack     at Process.ChildProcess._handle.onexit (node:internal/child_process:304:5)
node-pre-gyp ERR! System Darwin 23.0.0
node-pre-gyp ERR! command \"/Users/hyunjaelee/.nvm/versions/node/v16.20.2/bin/node\" \"/Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3/node_modules/.bin/node-pre-gyp\" \"install\" \"--fallback-to-build\"
node-pre-gyp ERR! cwd /Users/hyunjaelee/work/ondo-v1/node_modules/sqlite3
node-pre-gyp ERR! node -v v16.20.2
node-pre-gyp ERR! node-pre-gyp -v v0.11.0
node-pre-gyp ERR! not ok 
```

🏆 해결
- 파이선 3.0 설치
```
brew install python3
```
- Set python path
```
which python3
npm config set python /path/to/python
```
 
### error work/polymath-core/node_modules/sha3: Command failed.
```
error /Users/hyunjaelee/work/polymath-core/node_modules/sha3: Command failed.
Exit code: 1
Command: node-gyp rebuild
Arguments: 
Directory: /Users/hyunjaelee/work/polymath-core/node_modules/sha3
Output:
gyp info it worked if it ends with ok
gyp info using node-gyp@10.0.1
gyp info using node@21.2.0 | darwin | x64
gyp info find Python using Python version 3.9.6 found at "/Library/Developer/CommandLineTools/usr/bin/python3"

gyp http GET https://nodejs.org/download/release/v21.2.0/node-v21.2.0-headers.tar.gz
gyp http 200 https://nodejs.org/download/release/v21.2.0/node-v21.2.0-headers.tar.gz
gyp http GET https://nodejs.org/download/release/v21.2.0/SHASUMS256.txt
gyp http 200 https://nodejs.org/download/release/v21.2.0/SHASUMS256.txt
gyp info spawn /Library/Developer/CommandLineTools/usr/bin/python3
gyp info spawn args [
gyp info spawn args '/usr/local/Cellar/node/21.2.0/libexec/lib/node_modules/npm/node_modules/node-gyp/gyp/gyp_main.py',
gyp info spawn args 'binding.gyp',
gyp info spawn args '-f',
gyp info spawn args 'make',
gyp info spawn args '-I',
gyp info spawn args '/Users/hyunjaelee/work/polymath-core/node_modules/sha3/build/config.gypi',
gyp info spawn args '-I',
gyp info spawn args '/usr/local/Cellar/node/21.2.0/libexec/lib/node_modules/npm/node_modules/node-gyp/addon.gypi',
gyp info spawn args '-I',
gyp info spawn args '/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/common.gypi',
gyp info spawn args '-Dlibrary=shared_library',
gyp info spawn args '-Dvisibility=default',
gyp info spawn args '-Dnode_root_dir=/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0',
gyp info spawn args '-Dnode_gyp_dir=/usr/local/Cellar/node/21.2.0/libexec/lib/node_modules/npm/node_modules/node-gyp',
gyp info spawn args '-Dnode_lib_file=/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/<(target_arch)/node.lib',
gyp info spawn args '-Dmodule_root_dir=/Users/hyunjaelee/work/polymath-core/node_modules/sha3',
gyp info spawn args '-Dnode_engine=v8',
gyp info spawn args '--depth=.',
gyp info spawn args '--no-parallel',
gyp info spawn args '--generator-output',
gyp info spawn args 'build',
gyp info spawn args '-Goutput_dir=.'
gyp info spawn args ]
gyp info spawn make
gyp info spawn args [ 'BUILDTYPE=Release', '-C', 'build' ]
  CXX(target) Release/obj.target/sha3/src/addon.o
In file included from ../src/addon.cpp:4:
In file included from ../node_modules/nan/nan.h:173:
../node_modules/nan/nan_callbacks.h:55:23: error: no member named 'AccessorSignature' in namespace 'v8'
typedef v8::Local<v8::AccessorSignature> Sig;
                  ~~~~^
In file included from ../src/addon.cpp:4:
../node_modules/nan/nan.h:615:39: warning: 'IdleNotificationDeadline' is deprecated: Use MemoryPressureNotification() to influence the GC schedule. [-Wdeprecated-declarations]
    return v8::Isolate::GetCurrent()->IdleNotificationDeadline(
                                      ^
/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8-isolate.h:1339:3: note: 'IdleNotificationDeadline' has been explicitly marked deprecated here
  V8_DEPRECATE_SOON(
  ^
/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8config.h:551:39: note: expanded from macro 'V8_DEPRECATE_SOON'
# define V8_DEPRECATE_SOON(message) [[deprecated(message)]]
                                      ^
In file included from ../src/addon.cpp:4:
../node_modules/nan/nan.h:2470:8: error: no matching member function for call to 'SetAccessor'
  tpl->SetAccessor(
  ~~~~~^~~~~~~~~~~
/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8-template.h:816:8: note: candidate function not viable: no known conversion from 'imp::Sig' (aka 'int') to 'SideEffectType' for 7th argument
  void SetAccessor(
       ^
/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8-template.h:809:8: note: candidate function not viable: no known conversion from 'imp::NativeGetter' (aka 'void (*)(v8::Local<v8::Name>, const v8::PropertyCallbackInfo<v8::Value> &)') to 'AccessorGetterCallback' (aka 'void (*)(Local<String>, const PropertyCallbackInfo<Value> &)') for 2nd argument
  void SetAccessor(
       ^
In file included from ../src/addon.cpp:4:
In file included from ../node_modules/nan/nan.h:2818:
../node_modules/nan/nan_typedarray_contents.h:34:43: error: no member named 'GetContents' in 'v8::ArrayBuffer'
      data   = static_cast<char*>(buffer->GetContents().Data()) + byte_offset;
                                  ~~~~~~~~^
In file included from ../src/addon.cpp:9:
In file included from ../src/KeccakNISTInterface.h:17:
../src/KeccakSponge.h:23:9: warning: 'ALIGN' macro redefined [-Wmacro-redefined]
#define ALIGN __attribute__ ((aligned(32)))
        ^
/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/i386/param.h:85:9: note: previous definition is here
#define ALIGN(p)        __DARWIN_ALIGN(p)
        ^
In file included from ../src/addon.cpp:1:
In file included from /Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/node.h:73:
In file included from /Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8.h:24:
In file included from /Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8-array-buffer.h:12:
/Users/hyunjaelee/Library/Caches/node-gyp/21.2.0/include/node/v8-local-handle.h:253:5: error: static assertion failed due to requirement 'std::is_base_of<v8::Value, v8::Data>::value': type check
    static_assert(std::is_base_of<T, S>::value, "type check");
    ^             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
../node_modules/nan/nan_callbacks_12_inl.h:175:20: note: in instantiation of function template specialization 'v8::Local<v8::Value>::Local<v8::Data>' requested here
      cbinfo(info, obj->GetInternalField(kDataIndex));
                   ^
2 warnings and 4 errors generated.
make: *** [Release/obj.target/sha3/src/addon.o] Error 1
gyp ERR! build error 
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack at ChildProcess.<anonymous> (/usr/local/Cellar/node/21.2.0/libexec/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:209:23)
gyp ERR! System Darwin 23.0.0
gyp ERR! command "/usr/local/Cellar/node/21.2.0/bin/node" "/usr/local/Cellar/node/21.2.0/libexec/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/hyunjaelee/work/polymath-core/node_modules/sha3
```

🏆 해결
Node 16 버전을 사용함으로써 해결
```
nvm use 16 
```
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
* 해결방법: 그냥 폴더 자체를 지우고, git clone으로 소스를 다시 받음
	- artifacts를 지워도 안되었음.
	- 깨끗한 상태에서 잘되는 걸 보니, 리파지토리와 같이 파일이 정리된 상태이면 잘 될 것 같음.
* 에러 내용
```
An unexpected error occurred:

SyntaxError: /Users/hyunjaelee/work/commons-budget-contract/artifacts/@openzeppelin/contracts/utils/Context.sol/Context.dbg.json: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at /Users/hyunjaelee/work/commons-budget-contract/node_modules/jsonfile/index.js:33:18
    at /Users/hyunjaelee/work/commons-budget-contract/node_modules/graceful-fs/graceful-fs.js:123:16
    at FSReqCallback.readFileAfterClose [as oncomplete] (node:internal/fs/read_file_context:68:3)
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
* 에러 내용
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
node 버전 16을 사용해야하는데 18을 사용할때 문제 발생함.

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

npx hardhat node  // 꼭 hardhat 프로젝트 폴더에서 진행해야함.

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
npx hardhat node

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

### ondo-v1
- "local-node": "export BLOCKCHAIN='ethereum' && export POOH='JAY' && hardhat node",
  
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

## AWS
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
-------
## Know
 
🌟🏓🦋⚾️🐳🍀🌼🌸🏆🍜😈🐶🦄☕️🚘※

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

-------
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
### 🌸 hardhat 프로젝트 만들기 🌸
Hardhat은 기존 프로젝트에서는 안됨.
```
yarn init -y (=npm init -y)
yarn add --dev hardhat
npx hardhat // 여기서 이미 필요한 package는 추가됨
```

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


### 🌟 git submodule 🌟


😈 git submodule add 
```
git submodule add https://github.com/example/lib.git external/lib
git submodule update --init
```
😈 git submodule remove
```
git rm --cached poohgeth // path는 .gitmodules 파일의 참고
code .gitmodules // poohgeth 항목 제거
code .git/config // poohgeth 항목 제거
rm -rf .git/modules/poohgeth
rm -rf poohgeth // 안되면 sudo
git commit -am "Removed submodule"
git push
```
😈 git submodule update
```
git submodule update --remote
```
😈 하나만 다운로드 할때
```
git submodule update --init --recursive web2 
```

---
### 😈 git
- submodule의 HEAD를 알고 싶을때: 
  - git ls-tree HEAD lib/murky

---
### 🥎 hardhat/foundry 🥎
yarn add https://github.com/eth-infinitism/account-abstraction\#v0.6.0
yarn hardhat node (chain id: 31337)

---
### 🌸 IDEA
* Update TOC
```angular2html
mouse right click -> insert... -> update TOC
```
* Goto section
```
TOC에서 CMD 버튼 누르고 "#..." 항목 누르기
```
* 모듈 추가

File -> New -> Module from Existing Sources
주의: 검색되서 나온 체크를 그냥 그대로 두고 진행해야함. uncheck하면 안됨.

* Word Wrap
```
View -> Active Editor -> Use Soft Wraps
```
---
### 🌸 Whale 듀얼탭-Docker-Screen-AWS
**Docker**
- docker exec -it pow-node geth attach http://localhost:8545
- docker logs pow-node // enode 알아낼때 사용할 수 있음
- docker run --name postgresql \
    -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
    -p 5432:5432 \
    -d postgres:latest
- docker exec -it poohgeth-1 sh

**Screen**
- screen -S el1
- screen -ls // ls
- ctrl a+d // exit
- screen -S el1  -X quit
- screen -r -d 17288 <-- attatch되어 있는 것 detach

**AWS**
- 파일 가져오기:
scp -i ~/pooh/pooh-seoul.pem ubuntu@ec2-3-37-37-195.ap-northeast-2.compute.amazonaws.com:~/share/test.txt .

- 파일 보내기:
scp -i ~/pooh/pooh-seoul.pem test.txt ubuntu@ec2-3-37-37-195.ap-northeast-2.compute.amazonaws.com:~/share/test.txt


---
### 🌸 curl
- Post: 
curl -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -H "Content-Type: application/json" -X POST http://localhost:3000/mint

- Get: 
curl -d '{"address":"0x1666186e21F3c130fF15a6c2B0b1BbC4F6689B3F"}' -H "Content-type: application/json" -X GET "http://localhost:3000/balanceOf"

# #
🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓
NotImplementedError: Method 'HardhatEthersProvider.resolveName' is not implemented
      at HardhatEthersProvider.resolveName (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-ethers/src/internal/hardhat-ethers-provider.ts:364:11)
      at HardhatEthersSigner.resolveName (/Users/hyunjaelee/work/web/ex/node_modules/@nomicfoundation/hardhat-ethers/src/signers.ts:108:26)
      at new BaseContract (/Users/hyunjaelee/work/web/ex/node_modules/ethers/src.ts/contract/contract.ts:722:40)
      at new Contract (/Users/hyunjaelee/work/web/ex/node_modules/ethers/src.ts/contract/contract.ts:1120:1)
      at Context.<anonymous> (/Users/hyunjaelee/work/web/ex/test/zhacking/sensitive.ts:22:20)

==> const SECRET_DOOR_ADDRESS = '0x0x148f340701D3Ff95c7aA0491f5497709861Ca27D';
이런 실수는 하지 말자.

---
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try apt install
    python3-xyz, where xyz is the package you are trying to
    install.

---
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try brew install
    xyz, where xyz is the package you are trying to
    install.

==> pip3 install git+https://github.com/elyase/ethers-py --break-system-packages

---
  × Preparing metadata (pyproject.toml) did not run successfully.
  │ exit code: 1
  ╰─> [6 lines of output]

      Cargo, the Rust package manager, is not installed or is not on PATH.
      This package requires Rust and Cargo to compile extensions. Install it through
      the system's package manager or via https://rustup.rs/

      Checking for Rust toolchain....
==>  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
 export PATH="$HOME/.cargo/bin:$PATH"
 



🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓🏓
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

### 🌸 Code
forge script script/poohnet-fund/DeployPoohnetFund.s.sol --rpc-url localnet  --private-key $PRIVATE_KEY --broadcast

cast call $POOHNET_FUND_CONTRACT_ADDRESS "getOwner()" --rpc-url $LOCALNET_RPC_URL

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

=> 여기서 0x를 쓰면 안됨.
> hex_string = "48656c6c6f20576f726c64"  # Hex encoded string for "Hello World"
> byte_string = bytes.fromhex(hex_string)
> regular_string = byte_string.decode("utf-8")

from datetime import datetime
datetime.fromtimestamp(7214123987)

> print(f"{a:08x}{b:016x}{c:08x}")
0000006400000000000227b200000005

---
 w3 = Web3(Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/73I-qvN9yqtRcajnfvEarwA2FNHM4Nph')

---
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
# Move cursor to end of file in vim
:$
```
--- 
```
cmd w : close file in VS Code
"key": "ctrl+cmd+right", "command": "workbench.action.moveEditorToNextGroup"
"key": "ctrl+cmd+left", "command": "workbench.action.moveEditorToPreviousGroup"
```
**Column Selection with Keyboard**:
Hold down `Cmd + Shift + Option` and use the arrow keys to expand your selection vertically.

---
```
echo 'export PATH="/usr/local/opt/go@1.21/bin:$PATH"' >> /Users/jay/.zshrc
egrep -irnH --include=\*.cpp --exclude-dir=.svn 'beacon.pntbiz.com' ./
ps aux | grep postgres
tar --exclude='node_modules' -cvzf bccard.tar.gz bccard
tar -xvzf xxx.tar.gz -C ./data
zip -r ~/temp/my-archive.zip . -x '*.git*' -x '*node_modules*'
unzip my-archive.zip -d data //data 폴더에 풀고 싶을때.
history -100
```
---
- [dev.md text](bit.ly/3MT0VRb)
- [dev.md]([bit.ly/3MVG5AN)
- [site summary](https://bit.ly/2PmH3XE)
- \# # 로 검색하면 좋음
