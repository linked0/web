import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { RealtySale, RealtyToken, RealtyToken__factory } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Replay Attack Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, attacker: SignerWithAddress;

	let realtySale: RealtySale;
	let realtyToken: RealtyToken;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, attacker] = await getSigners();

		// Attacker starts with 1 ETH in balance
		await ethers.provider.send('hardhat_setBalance', [
			attacker.address,
			'0xde0b6b3a7640000', // 1 ETH
		]);

		// Deploy RealtySale

		realtySale = await deployContract('RealtySale');

		// Attach to deployed RealtyToken
		const ShareTokenFactory = (await ethers.getContractFactory('contracts/replay-attack-2/RealtyToken.sol:RealtyToken')) as RealtyToken__factory;
		const shareTokenAddress = await realtySale.getTokenContract();
		realtyToken = ShareTokenFactory.attach(shareTokenAddress) as unknown as RealtyToken;

		// Buy without sending ETH reverts
		await expect(realtySale.connect(user1).buy()).to.be.reverted;

		// Some users buy tokens (1 ETH each share)
		await realtySale.connect(user1).buy({ value: parseEther('1') });
		await realtySale.connect(user2).buy({ value: parseEther('1') });

		// 2 ETH in contract
		expect(await provider.getBalance(realtySale.target)).equals(parseEther('2'));

		// Buyer got their share token
		expect(await realtyToken.balanceOf(user1.address)).equals(1);
		expect(await realtyToken.balanceOf(user2.address)).equals(1);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker bought all 98 shares
		expect(await realtyToken.balanceOf(attacker.address)).equals(98);

		// No more shares left :(
		let maxSupply = await realtyToken.maxSupply();
		expect(await realtyToken.lastTokenID()).equals(maxSupply);
	});
});
