import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import { ethers, Wallet } from "ethers";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: ".env" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
      console.log(account.address);
  }
});

function getAccounts() {
  const accounts: HardhatNetworkAccountUserConfig[] = [];
  const defaultBalance = ethers.parseEther("2000000").toString();

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

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 18000,
          },
        },
      },
    ],
    overrides: {
      "contracts/UniswapV2ERC20.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/test/ERC20.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/UniswapV2Pair.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/UniswapV2Factory.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/libraries/UQ112x112.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/libraries/Math.sol": {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
      "contracts/libraries/SafeMath.sol": {
        version: "0.5.16",
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
      accounts: getAccounts(),
    },
    localnet: {
      url: "http://localhost:8545",
      chainId: 12301,
      accounts: [
        process.env.ADMIN_KEY ?? "",
        process.env.USER_KEY ?? "",
        process.env.OWNER_KEY ?? "",
      ],
    },
  },
};

export default config;
