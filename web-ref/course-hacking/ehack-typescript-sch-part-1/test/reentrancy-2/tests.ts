import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ApesAirdrop } from '../../typechain-types';

const { deployContract, getSigners } = ethers;

describe('Reentrancy Exercise 2', function () {
	const TOTAL_SUPPLY = 50;

	let deployer: SignerWithAddress,
		user1: SignerWithAddress,
		user2: SignerWithAddress,
		user3: SignerWithAddress,
		user4: SignerWithAddress,
		attacker: SignerWithAddress;

	let users: SignerWithAddress[];

	let airdrop: ApesAirdrop;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, user4, attacker] = await getSigners();
		users = [user1, user2, user3, user4, attacker];

		airdrop = await deployContract('ApesAirdrop');

		await airdrop.addToWhitelist(users.map((user) => user.address));

		for (let i = 0; i < users.length; i++) {
			expect(await airdrop.isWhitelisted(users[i].address)).equals(true);
		}
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */
		expect(await airdrop.balanceOf(attacker.address)).equals(TOTAL_SUPPLY);
	});
});
