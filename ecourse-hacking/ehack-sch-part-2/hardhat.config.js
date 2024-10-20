require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: __dirname + '/.env' });

// Constants
const FRONTRUNNING_MINING_INTERVAL = 10000; // 10 seconds
const MAINNET_FORK_BLOCK_NUMBER = 15969633;
const MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET = 16776127;
const GOERLI_FORK_BLOCK_NUMBER = 8660077;
const AVAX_C_CHAIN_BLOCK_GAS_LIMIT = 8_000_000;

const COMPILERS = [
  {
    version: '0.8.13',
  },
  {
    version: '0.6.12',
  },
  {
    version: '0.6.0',
  },
  {
    version: '0.5.12',
  },
  {
    version: '0.4.24',
  },
];

let scriptName;

if(process.argv[3] != undefined) {
  scriptName = process.argv[3];
} else {
  scriptName = ""
}

if (
  scriptName.includes('dex-1') ||
  scriptName.includes('dex-2') ||
  scriptName.includes('flash-loans-3') ||
  scriptName.includes('flash-loans-2') ||
  scriptName.includes('oracle-manipulation-2') ||
  scriptName.includes('oracle-manipulation-3') ||
  scriptName.includes('optimizer-vaults-2')
) {
  console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER}`);
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: MAINNET_FORK_BLOCK_NUMBER,
        },
      },
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
} else if (
  scriptName.includes('frontrunning') || 
  scriptName.includes('optimizer-vaults-1')
  ) {
  // Frontrunning exercises are with "hardhat node mode", mining interval is 10 seconds
  console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER}, Manual Mining Mode with interval of 10 seconds`);
  module.exports = {
    networks: {
      hardhat: {
        mining: {
          auto: false,
          interval: FRONTRUNNING_MINING_INTERVAL,
        },
        forking: {
          url: process.env.MAINNET,
          blockNumber: MAINNET_FORK_BLOCK_NUMBER,
        }
      },
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
} else if (
  scriptName.includes('money-markets')
) {
  console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET}`);
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET,
        },
      },
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
}
else if (
  scriptName.includes('sensitive-on-chain-data-2') ||
  scriptName.includes('sensitive-on-chain-data-3')
) {
  console.log(`Forking Goerli Block Height ${GOERLI_FORK_BLOCK_NUMBER}`);
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.GOERLI,
          blockNumber: GOERLI_FORK_BLOCK_NUMBER,
        },
      },
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
}
else if (scriptName.includes('gas-manipulation-1')) {
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: MAINNET_FORK_BLOCK_NUMBER,
        },
        gas: AVAX_C_CHAIN_BLOCK_GAS_LIMIT,
      },
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
}
else {
  module.exports = {
    networks: {
      hardhat: {
        // loggingEnabled: true
      },
      goerli: {
        url: process.env.GOERLI
      }
    },
    solidity: {
      compilers: COMPILERS,
    },
  };
}