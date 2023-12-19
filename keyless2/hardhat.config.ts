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
  solidity: "0.8.20",
  networks: {
    hardhat: {
      accounts: { mnemonic: process.env.MNEMONIC },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
