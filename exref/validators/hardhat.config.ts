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

// If not defined, randomly generated.
function createPrivateKey() {
    const reg_bytes64: RegExp = /^(0x)[0-9a-f]{64}$/i;
    if (
        process.env.ADMIN_KEY === undefined ||
        process.env.ADMIN_KEY.trim() === "" ||
        !reg_bytes64.test(process.env.ADMIN_KEY)
    ) {
        process.env.ADMIN_KEY = Wallet.createRandom().privateKey;
    }
}
createPrivateKey();

function getAccounts() {
    return [process.env.ADMIN_KEY || ""];
}

function getTestAccounts() {
    const accounts: HardhatNetworkAccountUserConfig[] = [];
    const defaultBalance = utils.parseEther("100000000").toString();

    const n = 10;
    for (let i = 0; i < n; ++i) {
        accounts.push({
            privateKey: Wallet.createRandom().privateKey,
            balance: defaultBalance,
        });
    }
    accounts[0].privateKey = process.env.ADMIN_KEY || "";

    return accounts;
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.16",
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
            accounts: getTestAccounts(),
            gas: 2100000,
            gasPrice: 8000000000,
        },
        mainnet: {
            url: process.env.MAIN_NET_URL || "",
            chainId: 2151,
            accounts: getAccounts(),
        },
        testnet: {
            url: process.env.TEST_NET_URL || "",
            chainId: 2019,
            accounts: getAccounts(),
        },
        devnet: {
            url: process.env.DEV_NET_URL || "",
            chainId: 2155,
            accounts: getAccounts(),
        },
        votera: {
            url: process.env.VOTERA_URL || "",
            chainId: 34560,
            accounts: getAccounts(),
        },
        localnet: {
            url: process.env.LOCALNET_URL || "",
            chainId: 34560,
            accounts: getAccounts(),
        },
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
};

export default config;
