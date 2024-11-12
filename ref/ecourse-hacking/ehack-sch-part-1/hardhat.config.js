require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: __dirname + '/.env' });

let scriptName;

if(process.argv[3] != undefined) {
  scriptName = process.argv[3];
} else {
  scriptName = ""
}

const BLOCK_HEIGHT = 15969633;

if (
  scriptName.includes('reentrancy-3') ||
  scriptName.includes('reentrancy-4') ||
  scriptName.includes('erc20-2')
) {
  console.log(`Forking Mainnet Block Height ${BLOCK_HEIGHT}`);
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: BLOCK_HEIGHT,
        },
      },
    },
    solidity: {
      compilers: [
        {
          version: '0.6.12',
        },
        {
          version: '0.5.12',
        },
        {
          version: '0.8.4',
        },
        {
          version: '0.8.13',
        },
        {
          version: '0.7.0',
        },
        {
          version: '0.6.0',
        },
        {
          version: '0.4.24',
        },
      ],
    },
  };
} else {
  module.exports = {
    networks: {
      hardhat: {
        // loggingEnabled: true
      },
    },
    solidity: {
      compilers: [
        {
          version: '0.6.12',
        },
        {
          version: '0.5.12',
        },
        {
          version: '0.8.4',
        },
        {
          version: '0.8.13',
        },
        {
          version: '0.7.0',
        },
        {
          version: '0.6.0',
        },
        {
          version: '0.4.24',
        },
      ],
    },
  };
}
