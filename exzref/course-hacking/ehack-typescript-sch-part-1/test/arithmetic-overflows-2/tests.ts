import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { SimpleToken } from '../../typechain-types';

const { parseEther, getSigners, deployContract } = ethers;

describe('Arithmetic Over/Underflow Exercise 2', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const ATTACKER1_MINT = parseEther('10');
	const DEPLOYER_MINT = parseEther('100000');

	let token: SimpleToken;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		token = await deployContract('SimpleToken');

		await token.mint(deployer.address, DEPLOYER_MINT);
		await token.mint(attacker.address, ATTACKER1_MINT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker should have a lot of tokens (at least more than 1 million)
		expect(await token.getBalance(attacker.address)).is.gt(parseEther('1000000'));
	});
});
