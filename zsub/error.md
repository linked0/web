# Error
### Fatal: Error starting protocol stack: listen tcp 127.0.0.1:8551: bind: address already in use
==> `--authrpc.port=8552` added in `run-marigold-localnet

```
INFO [03-14|16:21:43.053] HTTP server stopped                      endpoint=[::]:8885
INFO [03-14|16:21:43.053] HTTP server stopped                      endpoint=127.0.0.1:8886
INFO [03-14|16:21:43.053] IPC endpoint closed                      url=/Users/jay/.marigold/el/geth.ipc
Fatal: Error starting protocol stack: listen tcp 127.0.0.1:8551: bind: address already in use
./run-marigold-localnet: line 27: --engine-port=8552: command not found
```

#### Details
In Ethereum client configurations, particularly for execution clients like Geth or consensus clients like Lighthouse, the authrpc.port setting is used for authenticated RPC (AuthRPC) communication between execution and consensus layers.


### permission denied to set parameter "session_replication_role"
==> orm.config.ts에 `disableForeignKeys: false` 추가
```
const config: Options = {
  migrations: {
    path: "./src/migrations",
    tableName: "migrations",
    transactional: true,
    disableForeignKeys: false,
  },
  ...
}
```

##### 에러 상세
```
➜  rabbit-server git:(main) ✗ yarn start:dev
yarn run v1.22.22
$ nodemon src/index.ts
[nodemon] 3.1.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
NODE_DEV : true
DEPLOY_TARGET : undefined
POSTGRES_DB : rabbit-data
JWT_KEY : adslfkjalsdfjaskldf
S3_REGION : undefined
SHAREDASSET_CONTRACT : undefined
LAZY_MINT_ADAPTER : undefined
NATIVE_TOKEN : undefined
[info] MikroORM version: 5.9.8
[discovery] ORM entity discovery started, using ReflectMetadataProvider
[discovery] - processing 1 files
[discovery] - processing entity Actor (/Users/jay/work/snake0124/rabbit-server/src/entities/actor.entity.ts)
[discovery] - entity discovery finished, found 1 entities, took 72 ms
[info] MikroORM successfully connected to database rabbit-data on postgresql://rabbit_app:*****@localhost:5432
[query] select 1 from pg_database where datname = 'rabbit-data' [took 26 ms, 1 result]
[query] select 1 from pg_database where datname = 'rabbit-data' [took 2 ms, 1 result]
[query] select table_name, table_schema as schema_name, (select pg_catalog.obj_description(c.oid) from pg_catalog.pg_class c where c.oid = (select ('"' || table_schema || '"."' || table_name || '"')::regclass::oid) and c.relname = table_name) as table_comment from information_schema.tables where "table_schema" not like 'pg_%' and "table_schema" not like 'crdb_%' and "table_schema" not like '_timescaledb_%' and "table_schema" not in ('information_schema', 'tiger', 'topology') and table_name != 'geometry_columns' and table_name != 'spatial_ref_sys' and table_type != 'VIEW' order by table_name [took 23 ms, 0 result]
[query] select schema_name from information_schema.schemata where "schema_name" not like 'pg_%' and "schema_name" not like 'crdb_%' and "schema_name" not like '_timescaledb_%' and "schema_name" not in ('information_schema', 'tiger', 'topology') order by schema_name [took 2 ms, 1 result]
[query] create table "public"."migrations" ("id" serial primary key, "name" varchar(255), "executed_at" timestamptz default current_timestamp)
[query] select * from "public"."migrations" order by "id" asc [took 4 ms, 0 result]
[query] select table_name, table_schema as schema_name, (select pg_catalog.obj_description(c.oid) from pg_catalog.pg_class c where c.oid = (select ('"' || table_schema || '"."' || table_name || '"')::regclass::oid) and c.relname = table_name) as table_comment from information_schema.tables where "table_schema" not like 'pg_%' and "table_schema" not like 'crdb_%' and "table_schema" not like '_timescaledb_%' and "table_schema" not in ('information_schema', 'tiger', 'topology') and table_name != 'geometry_columns' and table_name != 'spatial_ref_sys' and table_type != 'VIEW' order by table_name [took 5 ms, 1 result]
[query] begin
[query] select * from "public"."migrations" order by "id" asc [took 3 ms, 0 result]
Processing 'Migration20240930063516'
[query] savepoint trx3
[query] set names 'utf8'; [took 0 ms, 0 result]
[query] set session_replication_role = 'replica'; [took 4 ms]
[query] rollback to savepoint trx3
[query] rollback
📌 Could not connect to the database MigrationError: Migration Migration20240930063516 (up) failed: Original error: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
    at /Users/jay/work/snake0124/rabbit-server/node_modules/umzug/src/umzug.ts:261:12
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Umzug.runCommand (/Users/jay/work/snake0124/rabbit-server/node_modules/umzug/src/umzug.ts:210:11)
    at async Migrator.runInTransaction (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/Migrator.js:301:21)
    at async PostgreSqlConnection.transactional (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/knex/AbstractSqlConnection.js:36:25) {
  cause: DriverException: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
      at PostgreSqlExceptionConverter.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/platforms/ExceptionConverter.js:8:16)
      at PostgreSqlExceptionConverter.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/postgresql/PostgreSqlExceptionConverter.js:42:22)
      at PostgreSqlDriver.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/drivers/DatabaseDriver.js:201:54)
      at /Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/drivers/DatabaseDriver.js:205:24
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async Function.runSerial (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/utils/Utils.js:611:22)
      at async connection.transactional.ctx (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/MigrationRunner.js:23:17)
      at async PostgreSqlConnection.transactional (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/knex/AbstractSqlConnection.js:36:25)
      at async MigrationRunner.run (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/MigrationRunner.js:20:13)
      at async createMigrationHandler (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/Migrator.js:191:13)
  
  previous error: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
      at Parser.parseErrorMessage (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:368:69)
      at Parser.handlePacket (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:187:21)
      at Parser.parse (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:102:30)
      at Socket.<anonymous> (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/index.ts:7:48)
      at Socket.emit (node:events:517:28)
      at Socket.emit (node:domain:489:12)
      at addChunk (node:internal/streams/readable:368:12)
      at readableAddChunk (node:internal/streams/readable:341:9)
      at Socket.Readable.push (node:internal/streams/readable:278:10)
      at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
    length: 121,
    severity: 'ERROR',
    code: '42501',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'guc.c',
    line: '7475',
    routine: 'set_config_option'
  },
  jse_cause: DriverException: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
      at PostgreSqlExceptionConverter.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/platforms/ExceptionConverter.js:8:16)
      at PostgreSqlExceptionConverter.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/postgresql/PostgreSqlExceptionConverter.js:42:22)
      at PostgreSqlDriver.convertException (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/drivers/DatabaseDriver.js:201:54)
      at /Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/drivers/DatabaseDriver.js:205:24
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async Function.runSerial (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/core/utils/Utils.js:611:22)
      at async connection.transactional.ctx (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/MigrationRunner.js:23:17)
      at async PostgreSqlConnection.transactional (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/knex/AbstractSqlConnection.js:36:25)
      at async MigrationRunner.run (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/MigrationRunner.js:20:13)
      at async createMigrationHandler (/Users/jay/work/snake0124/rabbit-server/node_modules/@mikro-orm/migrations/Migrator.js:191:13)
  
  previous error: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
      at Parser.parseErrorMessage (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:368:69)
      at Parser.handlePacket (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:187:21)
      at Parser.parse (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/parser.ts:102:30)
      at Socket.<anonymous> (/Users/jay/work/snake0124/rabbit-server/node_modules/pg-protocol/src/index.ts:7:48)
      at Socket.emit (node:events:517:28)
      at Socket.emit (node:domain:489:12)
      at addChunk (node:internal/streams/readable:368:12)
      at readableAddChunk (node:internal/streams/readable:341:9)
      at Socket.Readable.push (node:internal/streams/readable:278:10)
      at TCP.onStreamRead (node:internal/stream_base_commons:190:23) {
    length: 121,
    severity: 'ERROR',
    code: '42501',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: undefined,
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'guc.c',
    line: '7475',
    routine: 'set_config_option'
  },
  migration: {
    direction: 'up',
    name: 'Migration20240930063516',
    path: '/Users/jay/work/snake0124/rabbit-server/src/migrations/Migration20240930063516.ts',
    context: {}
  }
}
/Users/jay/work/snake0124/rabbit-server/src/application.ts:108
      throw Error(String(error));
            ^
Error: MigrationError: Migration Migration20240930063516 (up) failed: Original error: set session_replication_role = 'replica'; - permission denied to set parameter "session_replication_role"
    at Application.<anonymous> (/Users/jay/work/snake0124/rabbit-server/src/application.ts:108:13)
    at Generator.throw (<anonymous>)
    at rejected (/Users/jay/work/snake0124/rabbit-server/src/application.ts:6:65)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `ts-node src/index.ts`
/Users/jay/work/snake0124/rabbit-server/node_modules/ts-node/src/index.ts:859
    return new TSError(diagnosticText, diagnosticCodes, diagnostics);
           ^
```

### Invalid package.json
/Users/jay/.nvm/versions/node/v18.20.4/lib/node_modules/corepack/dist/lib/corepack.cjs:22147
      throw new UsageError(`Invalid package.json in ${import_path8.default.relative(initialCwd, manifestPath)}`);
            ^

UsageError: Invalid package.json in package.json
    at loadSpec (/Users/jay/.nvm/versions/node/v18.20.4/lib/node_modules/corepack/dist/lib/corepack.cjs:22147:13)
    at async Engine.findProjectSpec (/Users/jay/.nvm/versions/node/v18.20.4/lib/node_modules/corepack/dist/lib/corepack.cjs:22348:22)
    at async Engine.executePackageManagerRequest (/Users/jay/.nvm/versions/node/v18.20.4/lib/node_modules/corepack/dist/lib/corepack.cjs:22404:24)
    at async Object.runMain (/Users/jay/.nvm/versions/node/v18.20.4/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5) {
  clipanion: { type: 'usage' }

==>
```
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7", <== 이 부분이 문제임, 불필요한 콤마
  },
```

### 'com.docker.vmnetd'에 악성 코드가 포함되어 있어서 열리지 않았습니다.
```
sudo launchctl bootout system/com.docker.vmnetd 2>/dev/null || true
sudo launchctl bootout system/com.docker.socket 2>/dev/null || true

sudo rm /Library/PrivilegedHelperTools/com.docker.vmnetd || true
sudo rm /Library/PrivilegedHelperTools/com.docker.socket || true

ps aux | grep -i docker | awk '{print $2}' | sudo xargs kill -9 2>/dev/null
```

### throw new UsageError(`Invalid package.json ...
➜  tigger-swap-contracts git:(main) ✗ yarn install            
/Users/jay/.nvm/versions/node/v20.17.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22147
      throw new UsageError(`Invalid package.json in ${import_path8.default.relative(initialCwd, manifestPath)}`);
            ^

UsageError: Invalid package.json in package.json
    at loadSpec (/Users/jay/.nvm/versions/node/v20.17.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22147:13)
    at async Engine.findProjectSpec (/Users/jay/.nvm/versions/node/v20.17.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22348:22)
    at async Engine.executePackageManagerRequest (/Users/jay/.nvm/versions/node/v20.17.0/lib/node_modules/corepack/dist/lib/corepack.cjs:22404:24)
    at async Object.runMain (/Users/jay/.nvm/versions/node/v20.17.0/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5) {
  clipanion: { type: 'usage' }
}

Node.js v20.17.0

==> 
불필요한 `,`가 "fee:testnet" 라인에 있음. 
```
  "scripts": {
    "build": "hardhat compile",
    "console": "hardhat console",
    "deploy:localnet": "hardhat run --network localnet scripts/deploy-factory.js",
    "deploy:devnet": "export $(cat .env.devnet | xargs) && hardhat run --network devnet scripts/deploy-factory-devnet.js",
    "get-pair:localnet": "hardhat run --network localnet scripts/get-pair.js",
    "get-pair:devnet": "export $(cat .env.devnet | xargs) && hardhat run --network devnet scripts/get-pair-devnet.js",
    "fee:testnet": "hardhat run --network testnet scripts/get-fee-to.js",
  },
```


### mstore(0, INNER_OUT_OF_GAS)
```
unchecked {
    // handleOps was called with gas limit too low. abort entire bundle.
    if (preGas < callGasLimit + mUserOp.verificationGasLimit + 5000) {
        assembly {
            mstore(0, INNER_OUT_OF_GAS)
            revert(0, 32)
        }
     
}
```
**위의 코드에서 단지 아래 assembly 코드때문에 문제가 생김.**
**실상 저 if문 들어가지도 않고 실행이 다 되고 나서 Transaction Fail이 남.**
```
assembly {
  mstore(0, INNER_OUT_OF_GAS)
  revert(0, 32)
}
```

**아래와 같이 변경**
```
unchecked {
  // handleOps was called with gas limit too low. abort entire bundle.
  if (preGas < callGasLimit + mUserOp.verificationGasLimit + 5000) {
    revert(INNER_OUT_OF_GAS);
  }
}

```

스크립트 실행 로그
```
➜  webf git:(main) ✗ source .env; forge script script/erc6900/CallEntryPoint.s.sol:BasicUserOp --rpc-url $RPC_URL_LOCALNET --gas-limit 200000000 --broadcast --slow  -vvvvv
[⠒] Compiling...
[⠑] Compiling 1 files with Solc 0.8.24
[⠘] Solc 0.8.24 finished in 5.73s
Compiler run successful with warnings:
Warning (5667): Unused function parameter. Remove or comment out the variable name to silence this warning.
   --> lib/account-abstraction/contracts/core/EntryPoint.sol:232:77:
    |
232 |     function innerHandleOp(bytes memory callData, UserOpInfo memory opInfo, bytes calldata context) external returns (uint256 actualGasCost) {
    |                                                                             ^^^^^^^^^^^^^^^^^^^^^^

...

== Logs ==
  ownerAccount1: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c
  beneficiary balance: 1010000000000000000000
  recipient: 0x99e918CBe43341290E67067A3C6ddf03E751861B beneficiary: 0xE024589D0BCd59267E430fB792B29Ce7716566dF
  nonce: 0
  EntryPoint::handleOps
  beneficiary balance at end: 1011000000000000000000

## Setting up 1 EVM.
==========================
Simulated On-chain Traces:

  [127115] 0x844cB73DC22ae616D6B27684A72332fd0AACFD82::handleOps([UserOperation({ sender: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, nonce: 0, initCode: 0x, callData: 0xb61d27f600000000000000000000000099e918cbe43341290e67067a3c6ddf03e751861b0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000, callGasLimit: 50000 [5e4], verificationGasLimit: 120000 [1.2e5], preVerificationGas: 10, maxFeePerGas: 10, maxPriorityFeePerGas: 20, paymasterAndData: 0x, signature: 0x8155dd00278c957fcdc9437114b5f9c1d26864290148e50e5daeced57abe77b225d11dc429a92766f6b99caf25c09149cec9f7040de74f5547bce4f553aa211c1c })], 0xE024589D0BCd59267E430fB792B29Ce7716566dF)
    ├─ [0] console::log("EntryPoint::handleOps") [staticcall]
    │   └─ ← [Stop] 
    ├─ [52147] 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c::validateUserOp(UserOperation({ sender: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, nonce: 0, initCode: 0x, callData: 0xb61d27f600000000000000000000000099e918cbe43341290e67067a3c6ddf03e751861b0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000, callGasLimit: 50000 [5e4], verificationGasLimit: 120000 [1.2e5], preVerificationGas: 10, maxFeePerGas: 10, maxPriorityFeePerGas: 20, paymasterAndData: 0x, signature: 0x8155dd00278c957fcdc9437114b5f9c1d26864290148e50e5daeced57abe77b225d11dc429a92766f6b99caf25c09149cec9f7040de74f5547bce4f553aa211c1c }), 0x9903c6a3972c6abc46094319b67a8e2412d7f01473cc2af602f09a967e601208, 1700100 [1.7e6])
    │   ├─ [47101] 0x37f2Ae6c1C4d638B583462C44C57d13E051960dF::validateUserOp(UserOperation({ sender: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, nonce: 0, initCode: 0x, callData: 0xb61d27f600000000000000000000000099e918cbe43341290e67067a3c6ddf03e751861b0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000, callGasLimit: 50000 [5e4], verificationGasLimit: 120000 [1.2e5], preVerificationGas: 10, maxFeePerGas: 10, maxPriorityFeePerGas: 20, paymasterAndData: 0x, signature: 0x8155dd00278c957fcdc9437114b5f9c1d26864290148e50e5daeced57abe77b225d11dc429a92766f6b99caf25c09149cec9f7040de74f5547bce4f553aa211c1c }), 0x9903c6a3972c6abc46094319b67a8e2412d7f01473cc2af602f09a967e601208, 1700100 [1.7e6]) [delegatecall]
    │   │   ├─ [6882] 0x7C0A64a1ed25208133A156a395123971B52A20a0::userOpValidationFunction(1, UserOperation({ sender: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, nonce: 0, initCode: 0x, callData: 0xb61d27f600000000000000000000000099e918cbe43341290e67067a3c6ddf03e751861b0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000, callGasLimit: 50000 [5e4], verificationGasLimit: 120000 [1.2e5], preVerificationGas: 10, maxFeePerGas: 10, maxPriorityFeePerGas: 20, paymasterAndData: 0x, signature: 0x8155dd00278c957fcdc9437114b5f9c1d26864290148e50e5daeced57abe77b225d11dc429a92766f6b99caf25c09149cec9f7040de74f5547bce4f553aa211c1c }), 0x9903c6a3972c6abc46094319b67a8e2412d7f01473cc2af602f09a967e601208)
    │   │   │   ├─ [3000] PRECOMPILES::ecrecover(0xd4765370025a76d4b7d911ad583bbfa91c25a18e35e406840b85c089267f4cab, 28, 58500064757855179753356770091712841833154998082444311490392159816813610170290, 17105051873300532225426587738352130296342979792875145320829193135543164739868) [staticcall]
    │   │   │   │   └─ ← [Return] 0x000000000000000000000000e024589d0bcd59267e430fb792b29ce7716566df
    │   │   │   └─ ← [Return] 0
    │   │   ├─ [22278] 0x844cB73DC22ae616D6B27684A72332fd0AACFD82::fallback{value: 1700100}()
    │   │   │   ├─ emit Deposited(account: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, totalDeposit: 1700100 [1.7e6])
    │   │   │   └─ ← [Stop] 
    │   │   └─ ← [Return] 0
    │   └─ ← [Return] 0
    ├─ emit BeforeExecution()
    ├─ [19114] 0x844cB73DC22ae616D6B27684A72332fd0AACFD82::innerHandleOp(0xb61d27f600000000000000000000000099e918cbe43341290e67067a3c6ddf03e751861b0000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000, UserOpInfo({ mUserOp: MemoryUserOp({ sender: 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c, nonce: 0, callGasLimit: 50000 [5e4], verificationGasLimit: 120000 [1.2e5], preVerificationGas: 10, paymaster: 0x0000000000000000000000000000000000000000, maxFeePerGas: 10, maxPriorityFeePerGas: 20 }), userOpHash: 0x9903c6a3972c6abc46094319b67a8e2412d7f01473cc2af602f09a967e601208, prefund: 1700100 [1.7e6], contextOffset: 96, preOpGas: 85636 [8.563e4] }), 0x)
    │   ├─ [16812] 0x9977e41bdfCAD1b9cFB576Ae64e5c0E4e3440B0c::execute(0x99e918CBe43341290E67067A3C6ddf03E751861B, 1000000000000000000 [1e18], 0x)
    │   │   ├─ [16396] 0x37f2Ae6c1C4d638B583462C44C57d13E051960dF::execute(0x99e918CBe43341290E67067A3C6ddf03E751861B, 1000000000000000000 [1e18], 0x) [delegatecall]
    │   │   │   ├─ [0] 0x99e918CBe43341290E67067A3C6ddf03E751861B::supportsInterface(0x01ffc9a7) [staticcall]
    │   │   │   │   └─ ← [Stop] 
    │   │   │   ├─ [0] 0x99e918CBe43341290E67067A3C6ddf03E751861B::fallback{value: 1000000000000000000}()
    │   │   │   │   └─ ← [Stop] 
    │   │   │   └─ ← [Return] 0x
    │   │   └─ ← [Return] 0x
    │   └─ ← [Return] 0
    ├─ [0] 0xE024589D0BCd59267E430fB792B29Ce7716566dF::fallback{value: 1000000000000000000}()
    │   └─ ← [Stop] 
    └─ ← [Stop] 


==========================

Chain 12301

Estimated gas price: 0.500000014 gwei

Estimated total gas used for script: 180676

Estimated amount required: 0.000090338002529464 ETH

==========================

##### 12301
❌  [Failed]Hash: 0x140df53f553795e53f9b72104cc90be42a7328586c8a11ac61033cc6a79e4326
Block: 65767
Paid: 0.000063352500886935 ETH (126705 gas * 0.500000007 gwei)


Transactions saved to: /Users/jay/work/webf/broadcast/CallEntryPoint.s.sol/12301/run-latest.json

Sensitive values saved to: /Users/jay/work/webf/cache/CallEntryPoint.s.sol/12301/run-latest.json

Error: 
Transaction Failure: 0x140df53f553795e53f9b72104cc90be42a7328586c8a11ac61033cc6a79e4326
```

### vm.getCode doesn't find artifacts by name
Ran 1 test for forge-tests/lending/Comptroller/adminTest.t.sol:Test_Comptroller_Admin
[FAIL: setup failed: vm.getCode: no matching artifact found] setUp() (gas: 0)
Suite result: FAILED. 0 passed; 1 failed; 0 skipped; finished in 30.92ms (0.00ns CPU time)

==> unchecked_cheatcode_artifacts = true

### ProviderError: Must be authenticated!
      at HttpProvider.request (node_modules/hardhat/src/internal/core/providers/http.ts:49:19)
      at getNetworkId (node_modules/hardhat/src/internal/hardhat-network/provider/utils/makeForkClient.ts:109:43)
      at Object.makeForkClient (node_modules/hardhat/src/internal/hardhat-network/provider/utils/makeForkClient.ts:40:27)
      at Function.create (node_modules/hardhat/src/internal/hardhat-network/provider/node.ts:153:15)
      at HardhatNetworkProvider._init (node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:234:46)
      at HardhatNetworkProvider._send (node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:182:5)
      at HardhatNetworkProvider.request (node_modules/hardhat/src/internal/hardhat-network/provider/provider.ts:108:18)
      at EthersProviderWrapper.send (node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
      at Object.getSigners (node_modules/@nomiclabs/hardhat-ethers/src/internal/helpers.ts:88:20)
      at Context.<anonymous> (test/uni.spec.usdt-bond.ts:22:15)

==> .env에 Mainnet URL에 Alchemy API URL이 세팅되어야 함.
MAINNET_RPC_URL='https://eth-mainnet.g.alchemy.com/v2/API-KEY'

### URL.canParse(range)
/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:22095
  const isURL = URL.canParse(range);
                    ^
TypeError: URL.canParse is not a function
    at parseSpec (/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:22095:21)
    at loadSpec (/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:22158:11)
    at async Engine.findProjectSpec (/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:22348:22)
    at async Engine.executePackageManagerRequest (/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:22404:24)
    at async Object.runMain (/Users/jay/.nvm/versions/node/v16.20.2/lib/node_modules/corepack/dist/lib/corepack.cjs:23096:5)

==> nvm use 18


### NotImplementedError: Method 'HardhatEthersProvider.resolveName' is not implemented
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
 

### You probably tried to import the "hardhat" module from your config or a file imported from it. This is not possible, as Hardhat can't be initialized while its config is being defined.

==> Remove the line in hardhat.config.ts
```
const { ethers } = require("hardhat");
```

### src/entities/user.entity.ts:10:4 - error TS1240: Unable to resolve signature of property decorator when called as an expression.
  Argument of type 'undefined' is not assignable to parameter of type 'Object'.

10   @Field(() => Int)
      ~~~~~~~~~~~~~~~~

src/entities/user.entity.ts:11:4 - error TS1240: Unable to resolve signature of property decorator when called as an expression.
  Argument of type 'undefined' is not assignable to parameter of type 'Partial<any>'.

11   @PrimaryKey()
      ~~~~~~~~~~~~

==>
tsconfig.json에 아래와 같이 설정
```
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```


### $ hardhat run --network localnet script/deploy.ts
ProviderError: method handler crashed
    at HttpProvider.request (/Users/jay/work/pooh-land-contract/node_modules/hardhat/src/internal/core/providers/http.ts:107:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async EthersProviderWrapper.send (/Users/jay/work/pooh-land-contract/node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:13:20)
error Command failed with exit code 1.

==>

### error This project's package.json defines "packageManager": "yarn@4.4.1". However the current global version of Yarn is 1.22.22.

Presence of the "packageManager" field indicates that the project is meant to be used with Corepack, a tool included by default with all official Node.js distributions starting from 16.9 and 14.19.
Corepack must currently be enabled by running corepack enable in your terminal. For more information, check out https://yarnpkg.com/corepack.

==>
```
brew install corepack
corepack enable
brew unlink yarn
corepack prepare yarn@4.1.1 --activate
```

### Cannot connect to the Docker daemon at unix:///Users/hyunjaelee/.docker/run/docker.sock. Is the docker daemon running?

==> docker가 실행중이지 않음. 데스크탑 실행 필요. 업데이트 중일수 있음.

### 단위 테스트에서는 에러가 안나는데 전체 테스트 (yarn test)에서는 에러남
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

### 
Forking Mainnet Block Height 15969633, Manual Mining Mode with interval of 10 seconds
Error HH8: There's one or more errors in your config file:

  * Invalid value {"mining":{"auto":false,"interval":10000},"forking":{"blockNumber":15969633}} for HardhatConfig.networks.hardhat - Expected a value of type HardhatNetworkConfig.

To learn more about Hardhat's configuration, please go to https://hardhat.org/config/

==> hardhat.config.ts(혹은 js)에서 process.env.MAINNET을 찾는데, .env에 MAINNET_URL로 되어 있어서 에러남.

### Your branch is ahead of 'origin/pos' by 1 commit.
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

### remove python3.9 on ubuntu
sudo apt-get remove python3.9

### ubuntu@ip-172-31-22-252:~$ git clone git@github.com:linked0/poohgeth
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