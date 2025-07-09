import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

// Constants
const MAINNET_FORK_BLOCK_NUMBER = 15969633;

const MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET = 16776127;
const GOERLI_FORK_BLOCK_NUMBER = 8660077;
const AVAX_C_CHAIN_BLOCK_GAS_LIMIT = 8_000_000;

const MAINNET_URL = process.env.MAINNET;
if (!MAINNET_URL) console.log('Warning: MAINNET not found in .env\n');

const GOERLI_URL = process.env.GOERLI;
if (!GOERLI_URL) console.log('Warning: GOERLI not found in .env\n');

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.21',
			},
		],
		overrides: {
			'contracts/unchecked-returns-3/USDC.sol': {
				version: '0.6.12',
				settings: {},
			},
			'contracts/unchecked-returns-3/DAI.sol': {
				version: '0.5.12',
				settings: {},
			},
			'contracts/unchecked-returns-3/UST.sol': {
				version: '0.4.17',
				settings: {},
			},
		},
	},
};

let scriptName;

if (process.argv[3] != undefined) {
	scriptName = process.argv[3];
} else {
	scriptName = '';
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
	config.networks = {
		hardhat: {
			forking: {
				url: MAINNET_URL!,
				blockNumber: MAINNET_FORK_BLOCK_NUMBER,
			},
		},
	};
} else if (scriptName.includes('frontrunning') || scriptName.includes('optimizer-vaults-1')) {
	// Frontrunning exercises are with "hardhat node mode", mining interval is 10 seconds
	console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER}, Manual Mining Mode`);
	config.networks = {
		hardhat: {
			forking: {
				url: MAINNET_URL!,
				blockNumber: MAINNET_FORK_BLOCK_NUMBER,
			},
			mining: {
				auto: false,
				interval: 0,
			},
			gas: 'auto',
		},
	};
} else if (scriptName.includes('money-markets')) {
	console.log(`Forking Mainnet Block Height ${MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET}`);
	config.networks = {
		hardhat: {
			forking: {
				url: MAINNET_URL!,
				blockNumber: MAINNET_FORK_BLOCK_NUMBER_MONEY_MARKET,
			},
		},
	};
} else if (scriptName.includes('sensitive-on-chain-data-2') || scriptName.includes('sensitive-on-chain-data-3')) {
	console.log(`Forking Goerli Block Height ${GOERLI_FORK_BLOCK_NUMBER}`);
	config.networks = {
		hardhat: {
			forking: {
				url: process.env.GOERLI!,
				blockNumber: GOERLI_FORK_BLOCK_NUMBER,
			},
		},
	};
} else if (scriptName.includes('gas-manipulation-1')) {
	config.networks = {
		hardhat: {
			forking: {
				url: process.env.MAINNET!,
				blockNumber: MAINNET_FORK_BLOCK_NUMBER,
			},
			gas: AVAX_C_CHAIN_BLOCK_GAS_LIMIT,
		},
	};
} else {
	config.networks = {
		hardhat: {
			// loggingEnabled: true
		},
		goerli: {
			url: process.env.GOERLI,
		},
	};
}

export default config;
