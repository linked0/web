import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import type { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import "@nomiclabs/hardhat-waffle"
import { utils, Wallet } from "ethers";

dotenv.config({ path: ".env" });

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
      "contracts/WETH.sol": {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000,
          },
        },
      },
    },
  },
  defaultNetwork: "hardhat",
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
