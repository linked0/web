import * as dotenv from "dotenv";
import "@typechain/hardhat";
import { Wallet, Signer, utils } from "ethers-v5";
import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";

import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as fs from "fs";

import yargs from "yargs";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: ".env" });

// TODO: Fix this
// console.log("argv: ", yargs.argv);
// const argv = yargs.argv
//   .env('')
//   .option("gas", {
//     alias: 'gasReport',
//     type: "boolean",
//     default: false,
//   })
//   .help(false)
//   .version(false).argv;

// TODO: Apply this
// function getNetwork (name: string): { url: string, accounts: { mnemonic: string } } {
//   return getNetwork1(`https://${name}.infura.io/v3/${process.env.INFURA_ID}`)
//   // return getNetwork1(`wss://${name}.infura.io/ws/v3/${process.env.INFURA_ID}`)
// }

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

function getAccounts() {
  const accounts: HardhatNetworkAccountUserConfig[] = [];
  const defaultBalance = utils.parseEther("2000000").toString();

  const n = 10;
  for (let i = 0; i < n; ++i) {
    accounts.push({
      privateKey: Wallet.createRandom().privateKey,
      balance: defaultBalance,
    });
  }
  accounts[0].privateKey = process.env.ADMIN_KEY || "";
  accounts[1].privateKey = process.env.USER_KEY || "";

  return accounts;
}

const optimizerSettingsNoSpecializer = {
  enabled: true,
  runs: 4_294_967_295,
  details: {
    peephole: true,
    inliner: true,
    jumpdestRemover: true,
    orderLiterals: true,
    deduplicate: true,
    cse: true,
    constantOptimizer: true,
    yulDetails: {
      stackAllocation: true,
      optimizerSteps:
        "dhfoDgvulfnTUtnIf[xa[r]EscLMcCTUtTOntnfDIulLculVcul [j]Tpeulxa[rul]xa[r]cLgvifCTUca[r]LSsTOtfDnca[r]Iulc]jmul[jul] VcTOcul jmul",
    },
  },
};

// Dynamically get the test mode from environment variables
const testMode = process.env.TEST_MODE || '';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.23",
      },
      {
        version: "0.8.24",
        settings: {
          evmVersion: "cancun",
          // viaIR: true,
          // optimizer: {
          //   ...(process.env.NO_SPECIALIZER
          //     ? optimizerSettingsNoSpecializer
          //     : { enabled: true, runs: 4_294_967_295 }),
          // },
          // metadata: {
          //   bytecodeHash: "none",
          // },
          // outputSelection: {
          //   "*": {
          //     "*": ["evm.assembly", "irOptimized", "devdoc"],
          //   },
          // },
          optimizer: {
            enabled: true,
            runs: 200
          },
        },
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      hardfork: "cancun",
      allowUnlimitedContractSize: false,
      accounts: getAccounts(),
      mining: {
        auto: testMode !== 'disableAutoMining'
      }
    },
    localnet: {
      url: process.env.LOCALNET_URL,
      chainId: 12301,
      accounts: [process.env.ADMIN_KEY || "", process.env.USER_KEY || ""],
    },
    holesky: {
      url: "https://rpc.holesky.ethpandaops.io",
      chainId: 17000,
      accounts: [process.env.HOLESKY_ADMIN_KEY || ""],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      chainId: 11155111,
      accounts: [process.env.ADMIN_KEY || ""],
    },
    testnet: {
      url: process.env.TESTNET_URL,
      chainId: 12301,
      accounts: [process.env.ADMIN_KEY || "", process.env.USER_KEY || ""],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    // Optional settings for more detailed reports
    // gasPrice: 20,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Fetch real-time gas price
    // outputFile: 'gas-report.txt', // Save report to file
    // noColors: true, // Disable console colors
  },
};

// Constants
const GOERLI_FORK_BLOCK_NUMBER = 8660077;

let scriptName;

if (process.argv[3] != undefined) {
  scriptName = process.argv[3];
} else {
  scriptName = '';
}

if (scriptName.includes('sensitive')) {
  console.log(`Forking Goerli Block Height ${GOERLI_FORK_BLOCK_NUMBER}`);
  config.networks = {
    hardhat: {
      forking: {
        url: process.env.GOERLI_URL!,
        blockNumber: GOERLI_FORK_BLOCK_NUMBER,
      },
    },
  };
}

export default config;
