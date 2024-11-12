import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Starlight } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Access Control Exercise 4', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	const USER1_PURCHASE = parseEther('95');
	const USER2_PURCHASE = parseEther('65');
	const USER3_PURCHASE = parseEther('33');

	let starlight: Starlight;
	let attackerInitialETHBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await getSigners();

		attackerInitialETHBalance = await provider.getBalance(attacker.address);

		starlight = await deployContract('Starlight');

		// Users buy starlight tokens
		await starlight.connect(user1).buyTokens(USER1_PURCHASE * 100n, user1.address, {
			value: USER1_PURCHASE,
		});
		await starlight.connect(user2).buyTokens(USER2_PURCHASE * 100n, user2.address, {
			value: USER2_PURCHASE,
		});
		await starlight.connect(user3).buyTokens(USER3_PURCHASE * 100n, user3.address, {
			value: USER3_PURCHASE,
		});
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker stole all the ETH from the token sale contract
		let attackerBalance = await provider.getBalance(attacker.address);
		expect(attackerBalance).is.gt(attackerInitialETHBalance + USER1_PURCHASE + USER2_PURCHASE + USER3_PURCHASE - parseEther('0.2'));
	});
});
