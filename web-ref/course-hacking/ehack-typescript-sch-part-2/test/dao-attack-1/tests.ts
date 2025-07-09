import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { RainbowAllianceToken } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('DAO Attack Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;

	const DEPLOYER_MINT = parseEther('1000');
	const USERS_MINT = parseEther('100');
	const USER2_BURN = parseEther('30');

	let rainbowAlliance: RainbowAllianceToken;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user1, user2, user3] = await getSigners();

		// Deploy contract
		rainbowAlliance = await deployContract('RainbowAllianceToken');

		// Mint for deployer tokens
		await rainbowAlliance.mint(deployer.address, DEPLOYER_MINT);

		// Mint tokens to user1 and user2
		await rainbowAlliance.mint(user1.address, USERS_MINT);
		await rainbowAlliance.mint(user2.address, USERS_MINT);

		// Burn tokens from user2
		await rainbowAlliance.burn(user2.address, USER2_BURN);
	});

	it('Test governance', async function () {
		/** TESTS - DON'T CHANGE ANYTHING HERE */

		// Can't create proposals, if there is no voting power
		await expect(rainbowAlliance.connect(user3).createProposal('Donate 1000$ to charities')).to.be.revertedWith('no voting rights');

		// Should be able to create proposals if you have voting power
		await expect(await rainbowAlliance.createProposal('Pay 100$ to george for a new Logo')).to.not.be.reverted;

		// Can't vote twice
		await expect(rainbowAlliance.vote(1, true)).to.be.revertedWith('already voted');

		// Shouldn't be able to vote without voting rights
		await expect(rainbowAlliance.connect(user3).vote(1, true)).to.be.revertedWith('no voting rights');

		// Non existing proposal, reverts
		await expect(rainbowAlliance.vote(123, false)).to.be.revertedWith("proposal doesn't exist");

		// Users votes
		await rainbowAlliance.connect(user1).vote(1, true);
		await rainbowAlliance.connect(user2).vote(1, false);

		// Check accounting is correct
		let proposal = await rainbowAlliance.getProposal(1);
		console.log(proposal);
		// Supposed to be 1,100 (User1 - 100, deployer - 1,000)
		expect(proposal.yes).to.equal(DEPLOYER_MINT + USERS_MINT);
		// Supposed to be 70 (100 - 30, becuase we burned 30 tokens of user2)
		expect(proposal.no).to.equal(USERS_MINT - USER2_BURN);
	});

	it('PoC (Test which catches the bug)', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Complete the test that catches the bug
	});
});
