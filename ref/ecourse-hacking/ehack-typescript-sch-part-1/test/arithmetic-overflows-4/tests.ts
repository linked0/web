import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { PumpMeToken } from '../../typechain-types';

const { parseEther, getSigners, deployContract } = ethers;

describe('Arithmetic Over/Underflow Exercise 4', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const INITIAL_SUPPLY = parseEther('1000000');

	let token: PumpMeToken;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		token = await deployContract('PumpMeToken', [INITIAL_SUPPLY]);

		let attackerBalance = await token.balanceOf(attacker.address);
		let deployerBalance = await token.balanceOf(deployer.address);
		expect(attackerBalance).equals(0);
		expect(deployerBalance).equals(INITIAL_SUPPLY);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker should have a lot of tokens (at least more than 1 million)
		let attackerBalanceAfter = await token.balanceOf(attacker.address);
		expect(attackerBalanceAfter).is.gt(INITIAL_SUPPLY);
	});
});
