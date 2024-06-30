import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DAI, StableSwap, USDC, UST } from '../../typechain-types';

const { deployContract, getSigners, parseUnits } = ethers;

describe('Unchecked Returns Exercise 3', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const TOKENS_INITIAL_SUPPLY = parseUnits('100000000', 6); // $100M
	const TOKENS_IN_STABLESWAP = parseUnits('1000000', 6); // $1M
	const CHAIN_ID = 31337;

	let ust: UST;
	let dai: DAI;
	let usdc: USDC;

	let stableSwap: StableSwap;

	let stableSwapDAIBalance: bigint;
	let stableSwapUSDCBalance: bigint;
	let stableSwapUSTBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		// Deploy Tokens
		// Deploy UST
		ust = await deployContract('UST', [TOKENS_INITIAL_SUPPLY, 'Terra USD', 'UST', 6]);
		// Deploy DAI
		dai = await deployContract('DAI', [CHAIN_ID]);
		// Deploy USDC
		usdc = await deployContract('USDC');
		await usdc.initialize('Center Coin', 'USDC', 'USDC', 6, deployer.address, deployer.address, deployer.address, deployer.address);

		// Mint Tokens to Deployer
		await dai.mint(deployer.address, TOKENS_INITIAL_SUPPLY);
		await usdc.configureMinter(deployer.address, TOKENS_INITIAL_SUPPLY);
		await usdc.mint(deployer.address, TOKENS_INITIAL_SUPPLY);

		// Deploy StableSwap
		stableSwap = await deployContract('StableSwap', [[ust.target, usdc.target, dai.target]]);

		// Check allowed tokens
		expect(await stableSwap.isSupported(usdc.target, dai.target)).equals(true);
		expect(await stableSwap.isSupported(usdc.target, ust.target)).equals(true);

		// Send tokens to StableSwap
		await ust.transfer(stableSwap.target, TOKENS_IN_STABLESWAP);
		await dai.transfer(stableSwap.target, TOKENS_IN_STABLESWAP);
		await usdc.transfer(stableSwap.target, TOKENS_IN_STABLESWAP);

		// Check StableSwap Balance
		expect(await ust.balanceOf(stableSwap.target)).equals(TOKENS_IN_STABLESWAP);
		expect(await dai.balanceOf(stableSwap.target)).equals(TOKENS_IN_STABLESWAP);
		expect(await usdc.balanceOf(stableSwap.target)).equals(TOKENS_IN_STABLESWAP);

		// Swap works, balances are ok
		const amount = parseUnits('100', 6);
		await usdc.approve(stableSwap.target, amount);

		await expect(stableSwap.swap(usdc.target, dai.target, amount)).to.not.be.reverted;
		expect(await usdc.balanceOf(stableSwap.target)).equals(TOKENS_IN_STABLESWAP + amount);
		expect(await dai.balanceOf(stableSwap.target)).equals(TOKENS_IN_STABLESWAP - amount);

		// Swap fails without allowance
		await expect(stableSwap.swap(usdc.target, dai.target, amount)).to.be.reverted;

		stableSwapDAIBalance = await dai.balanceOf(stableSwap.target);
		stableSwapUSDCBalance = await usdc.balanceOf(stableSwap.target);
		stableSwapUSTBalance = await ust.balanceOf(stableSwap.target);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker was able to drain the entire protocol balance!
		expect(await usdc.balanceOf(stableSwap.target)).equals(0);
		expect(await dai.balanceOf(stableSwap.target)).equals(0);
		expect(await ust.balanceOf(stableSwap.target)).equals(0);

		expect(await usdc.balanceOf(attacker.address)).equals(stableSwapUSDCBalance);
		expect(await dai.balanceOf(attacker.address)).equals(stableSwapDAIBalance);
		expect(await ust.balanceOf(attacker.address)).equals(stableSwapUSTBalance);
	});
});
