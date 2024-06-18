import * as dotenv from "dotenv";
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import { HardhatUserConfig, task } from 'hardhat/config'
import 'hardhat-deploy'
import '@nomiclabs/hardhat-etherscan'
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import 'solidity-coverage'
import * as fs from 'fs'
import yargs from "yargs";

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
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    localnet: {
      url: process.env.LOCALNET_URL,
      chainId: 12301,
      accounts: [process.env.ADMIN_KEY || "",
      process.env.USER_KEY || "",
      ]
    },
    holesky: {
      url: "https://rpc.holesky.ethpandaops.io",
      chainId: 17000,
      accounts: [process.env.HOLESKY_ADMIN_KEY || ""]
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      chainId: 11155111,
      accounts: [process.env.ADMIN_KEY || ""]
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // Optional settings for more detailed reports
    // gasPrice: 20,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY, // Fetch real-time gas price
    // outputFile: 'gas-report.txt', // Save report to file
    // noColors: true, // Disable console colors
  },
};

export default config;
