import * as dotenv from "dotenv";

// tslint:disable-next-line:no-submodule-imports
import { HardhatUserConfig, task } from "hardhat/config";
// tslint:disable-next-line:no-submodule-imports
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";

import { utils, Wallet } from "ethers";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config({ path: "env/.env" });

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

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.0",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 5000000,
            },
        },
    },
    networks: {
        hardhat: {
            accounts: getAccounts(),
        },
        mainnet: {
            url: process.env.MAINNET_URL || "",
            chainId: 2151,
            accounts: [process.env.ADMIN_KEY || "", process.env.VOTE_KEY || "", process.env.USER_KEY || ""],
        },
        testnet: {
            url: process.env.TESTNET_URL || "",
            chainId: 2019,
            accounts: [process.env.ADMIN_KEY || "", process.env.VOTE_KEY || "", process.env.USER_KEY || ""],
        },
        devnet: {
            url: process.env.DEVNET_URL || "",
            chainId: 2155,
            accounts: [process.env.ADMIN_KEY || "", process.env.VOTE_KEY || "", process.env.USER_KEY || ""],
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
};

export default config;
