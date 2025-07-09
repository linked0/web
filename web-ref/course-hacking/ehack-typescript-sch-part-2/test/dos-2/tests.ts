import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Auction } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('DOS Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, attacker: SignerWithAddress;

	const USER1_FIRST_BID = parseEther('5');
	const USER2_FIRST_BID = parseEther('6.5');

	let auction: Auction;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, attacker] = await getSigners();

		auction = await deployContract('Auction');

		// Invest
		await auction.connect(user1).bid({ value: USER1_FIRST_BID });
		await auction.connect(user2).bid({ value: USER2_FIRST_BID });

		expect(await auction.highestBid()).equals(USER2_FIRST_BID);
		expect(await auction.currentLeader()).equals(user2.address);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Current highest bid
		let highestBid = await auction.highestBid();

		// Even though User1 bids highestBid * 3, transaction is reverted
		await expect(auction.connect(user1).bid({ value: highestBid * 3n })).to.be.reverted;

		// // User1 and User2 are not currentLeader
		expect(await auction.currentLeader()).to.not.equal(user1.address);
		expect(await auction.currentLeader()).to.not.equal(user2.address);
	});
});
