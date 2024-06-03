import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: ".env" });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.8.25",
      },
    ],
  },
  networks: {
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
  },
};

export default config;
