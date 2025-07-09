import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ToTheMoon } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('Access Control Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, attacker: SignerWithAddress;

	const INITIAL_MINT = parseEther('1000');
	const USER_MINT = parseEther('10');

	let toTheMoon: ToTheMoon;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user1, attacker] = await getSigners();

		toTheMoon = await deployContract('ToTheMoon', [INITIAL_MINT]);

		await toTheMoon.mint(user1.address, USER_MINT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker has 1 million tokens
		expect(await toTheMoon.balanceOf(attacker.address)).is.gt(parseEther('1000000'));
	});
});
