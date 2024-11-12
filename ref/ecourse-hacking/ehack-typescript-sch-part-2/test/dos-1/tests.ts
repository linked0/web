import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { TokenSale } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('DOS Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	const USER1_INVESTMENT = parseEther('5');
	const USER2_INVESTMENT = parseEther('15');
	const USER3_INVESTMENT = parseEther('23');

	let tokenSale: TokenSale;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await getSigners();

		tokenSale = await deployContract('TokenSale');

		// Invest
		await tokenSale.connect(user1).invest({ value: USER1_INVESTMENT });
		await tokenSale.connect(user2).invest({ value: USER2_INVESTMENT });
		await tokenSale.connect(user3).invest({ value: USER3_INVESTMENT });

		expect(await tokenSale.claimable(user1.address, 0)).equals(USER1_INVESTMENT * 5n);
		expect(await tokenSale.claimable(user2.address, 0)).equals(USER2_INVESTMENT * 5n);
		expect(await tokenSale.claimable(user3.address, 0)).equals(USER3_INVESTMENT * 5n);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	}).timeout(100000000);

	after(async function () {
		/** SUCCESS CONDITIONS */

		// DOS to distributeTokens
		await expect(tokenSale.distributeTokens()).to.be.reverted;
	});
});
