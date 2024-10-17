import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DummyERC20, RentingLibrary, SecureStore } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('Calls Attacks Exercise 2', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;
	let rentingLibrary: RentingLibrary;
	let usdc: DummyERC20;
	let secureStore: SecureStore;

	const INITIAL_SUPPLY = parseEther('100');
	const ATTACKER_INITIAL_BALANCE = parseEther('100');
	const STORE_INITIAL_BALANCE = parseEther('100000');
	const DAILY_RENT_PRICE = parseEther('50');

	before(async () => {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await ethers.getSigners();

		// Deploy Library Contract
		rentingLibrary = await deployContract('RentingLibrary');
		// Deploy Token
		usdc = await deployContract('DummyERC20', ['USDC Token', 'USDC', INITIAL_SUPPLY]);
		// Deploy secureStore Contract
		secureStore = await deployContract('SecureStore', [rentingLibrary.target, DAILY_RENT_PRICE, usdc.target]);

		// Setting up the attacker
		await usdc.mint(attacker.address, ATTACKER_INITIAL_BALANCE);

		// Setting up the SecureStore
		await usdc.mint(secureStore.target, STORE_INITIAL_BALANCE);
	});

	it('Exploit', async () => {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async () => {
		/** SUCCESS CONDITIONS */

		// Attacker stole all the funds from the SecureStore contract
		expect(await usdc.balanceOf(secureStore.target)).to.eq(0);
		expect(await usdc.balanceOf(attacker.address)).to.eq(ATTACKER_INITIAL_BALANCE + STORE_INITIAL_BALANCE);
	});
});
