import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import { Wallet, Signer, ethers } from "ethers";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: ".env" });

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
  solidity: "0.8.24",
  // defaultNetwork: "hardhat",
  // networks: {
  //   hardhat: {
  //     hardfork: "cancun",
  //     allowUnlimitedContractSize: false,
  //     accounts: getAccounts(),
  //   },
  // },
};

export default config;
