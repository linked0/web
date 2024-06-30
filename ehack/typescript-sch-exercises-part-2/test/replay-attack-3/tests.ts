import { ethers, network } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { RedHawksVIP } from '../../typechain-types';

const { deployContract, getSigners } = ethers;

describe('Replay Attack Exercise 3', function () {
	let deployer: SignerWithAddress, vouchersSigner: SignerWithAddress, user: SignerWithAddress, attacker: SignerWithAddress;

	let redHawks: RedHawksVIP;

	let validSignature: string;
	let invalidSignature: string;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, vouchersSigner, user, attacker] = await getSigners();

		// Deploy the contract
		redHawks = await deployContract('RedHawksVIP', [vouchersSigner.address]);

		// Create 2 NFTs voucher
		const domain = {
			chainId: network.config.chainId, // Localhost Chain ID
			verifyingContract: redHawks.target.toString(),
		};
		const types = {
			VoucherData: [
				{ name: 'amountOfTickets', type: 'uint256' },
				{ name: 'password', type: 'string' },
			],
		};
		const dataToSign = {
			amountOfTickets: '2',
			password: 'RedHawksRulzzz133',
		};

		// This is how the signature you found on Ethereum mempool was created
		validSignature = await vouchersSigner.signTypedData(domain, types, dataToSign);
		// Invalid signature (signed by another account)
		invalidSignature = await deployer.signTypedData(domain, types, dataToSign);

		// Invalid signer doesn't work
		await expect(redHawks.connect(user).mint(2, 'RedHawksRulzzz133', invalidSignature)).to.be.revertedWith('Invalid voucher');

		// Invalid data doesn't work
		await expect(redHawks.connect(user).mint(2, 'wrongPassword', validSignature)).to.be.revertedWith('Invalid voucher');

		// Can use valid voucher
		await redHawks.connect(user).mint(2, 'RedHawksRulzzz133', validSignature);

		// 2 NFT minted
		expect(await redHawks.balanceOf(user.address)).equals(2);

		// Can't use voucher twice
		await expect(redHawks.connect(user).mint(2, 'RedHawksRulzzz133', validSignature)).to.be.revertedWith('Voucher used');
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker got all 178 VIP Membership Tickets
		expect(await redHawks.balanceOf(attacker.address)).equals(178);
	});
});
