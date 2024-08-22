import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

import 'dotenv/config';

const BLOCK_HEIGHT = 15969633; // The block height used for exercises executed on a forked mainnet

const MAINNET_URL = process.env.MAINNET;
if (!MAINNET_URL) console.log('Warning: MAINNET not found in .env\n');

let shouldFork = false;

if (process.argv[3] != undefined) {
	const scriptName = process.argv[3];
	shouldFork = scriptName.includes('reentrancy-3') || scriptName.includes('reentrancy-4') || scriptName.includes('erc20-2');
}

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.21',
			},
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
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
};

console.log(shouldFork ? `Forking Mainnet Block Height ${BLOCK_HEIGHT}` : 'Launching Local Chain');

shouldFork
	? (config.networks = {
			hardhat: {
				forking: {
					url: MAINNET_URL!,
					blockNumber: BLOCK_HEIGHT,
				},
			},
	  })
	: (config.networks = {
			hardhat: {
				// loggingEnabled: true
			},
	  });

export default config;
