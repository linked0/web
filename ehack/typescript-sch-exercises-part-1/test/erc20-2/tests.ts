import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { IERC20 } from '../../typechain-types';

const { formatUnits, parseEther, deployContract, getSigners } = ethers;

describe('ERC20 Tokens Exercise 2', function () {
	let deployer: SignerWithAddress, aaveHolder: SignerWithAddress, uniHolder: SignerWithAddress, wethHolder: SignerWithAddress;

	const AAVE_ADDRESS = '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9';
	const UNI_ADDRESS = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
	const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

	const AAVE_HOLDER = '0x2efb50e952580f4ff32d8d2122853432bbf2e204';
	const UNI_HOLDER = '0x193ced5710223558cd37100165fae3fa4dfcdc14';
	const WETH_HOLDER = '0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3';

	const ONE_ETH = parseEther('1');

	let aave: IERC20;
	let uni: IERC20;
	let weth: IERC20;

	let initialAAVEBalance: bigint;
	let initialUNIBalance: bigint;
	let initialWETHBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer] = await getSigners();

		// Load tokens mainnet contracts
		aave = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', AAVE_ADDRESS)) as unknown as IERC20;
		uni = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', UNI_ADDRESS)) as unknown as IERC20;
		weth = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', WETH_ADDRESS)) as unknown as IERC20;

		// Load holders (accounts which hold tokens on Mainnet)
		aaveHolder = await ethers.getImpersonatedSigner(AAVE_HOLDER);
		uniHolder = await ethers.getImpersonatedSigner(UNI_HOLDER);
		wethHolder = await ethers.getImpersonatedSigner(WETH_HOLDER);

		// Send some ETH to tokens holders
		await deployer.sendTransaction({
			to: aaveHolder.address,
			value: ONE_ETH,
		});
		await deployer.sendTransaction({
			to: uniHolder.address,
			value: ONE_ETH,
		});
		await deployer.sendTransaction({
			to: wethHolder.address,
			value: ONE_ETH,
		});

		initialAAVEBalance = await aave.balanceOf(aaveHolder.address);
		initialUNIBalance = await uni.balanceOf(uniHolder.address);
		initialWETHBalance = await weth.balanceOf(wethHolder.address);

		console.log('AAVE Holder AAVE Balance: ', formatUnits(initialAAVEBalance));
		console.log('UNI Holder UNI Balance: ', formatUnits(initialUNIBalance));
		console.log('WETH Holder WETH Balance: ', formatUnits(initialWETHBalance));
	});

	it('Deploy depository and load receipt tokens', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Deploy your depository contract with the supported assets
		// TODO: Load receipt tokens into objects under `this` (e.g rAve)
	});

	it('Deposit tokens tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Deposit Tokens
		// 15 AAVE from AAVE Holder
		// 5231 UNI from UNI Holder
		// 33 WETH from WETH Holder
		// TODO: Check that the tokens were sucessfuly transfered to the depository
		// TODO: Check that the right amount of receipt tokens were minted
	});

	it('Withdraw tokens tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Withdraw ALL the Tokens
		// TODO: Check that the right amount of tokens were withdrawn (depositors got back the assets)
		// TODO: Check that the right amount of receipt tokens were burned
	});
});
