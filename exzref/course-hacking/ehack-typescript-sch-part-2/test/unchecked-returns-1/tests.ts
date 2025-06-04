import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DonationMaster, MultiSigSafe } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('Unchecked Returns Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;

	const ONE_ETH = parseEther('1'); // 100 ETH
	const HUNDRED_ETH = parseEther('100'); // 100 ETH
	const THOUSAND_ETH = parseEther('1000'); // 100 ETH

	let donationMaster: DonationMaster;
	let multiSig: MultiSigSafe;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user1, user2, user3] = await getSigners();

		// Deploy DonationMaster contract
		donationMaster = await deployContract('DonationMaster');

		// Deploy MultiSigSafe contract (2 signatures out of 3)
		multiSig = await deployContract('MultiSigSafe', [[user1.address, user2.address, user3.address], 2]);
	});

	it('Donation tests', async function () {
		/* SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		// New donation works
		await donationMaster.newDonation(multiSig.target, HUNDRED_ETH);
		let donationId = (await donationMaster.donationsNo()) - 1n;

		// Donating to multisig wallet works
		await donationMaster.donate(donationId, { value: ONE_ETH });

		// Validate donation details
		let donationInfo = await donationMaster.donations(donationId);
		expect(donationInfo.id).equals(donationId);
		expect(donationInfo.to).equals(multiSig.target);
		expect(donationInfo.goal).equals(HUNDRED_ETH);
		expect(donationInfo.donated).equals(ONE_ETH);

		// Too big donation fails (goal reached)
		await expect(donationMaster.donate(donationId, { value: THOUSAND_ETH })).to.be.reverted;
	});

	it('Fixed tests', async function () {
		/* CODE YOUR SOLUTION HERE */
		/* Write the correct tests here */
	});
});
