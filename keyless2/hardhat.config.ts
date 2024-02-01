import * as dotenv from "dotenv";
import { task, HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import "hardhat-deploy";

dotenv.config({ path: ".env" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (args, hre) => {
//   const accounts = await hre.ethers.getSigners();
//   for (const account of accounts) {
//     console.log(await account.address);
//   }
// });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: { enabled: true, runs: 1000000 }
        }
      },
    ],
    overrides: {
      "contracts/Create2Factory.sol": {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      'contracts/Test.sol': {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      accounts: { mnemonic: process.env.MNEMONIC },
    },
    testnet: {
      url: process.env.TESTNET_URL,
      accounts: [process.env.ADMIN_KEY],
      chainId: parseInt(process.env.TESTNET_CHAIN_ID),
      gas: 2100000,
      gasPrice: 8000000000
   },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
