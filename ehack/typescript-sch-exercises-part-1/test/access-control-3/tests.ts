import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { KilianExclusive } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Access Control Exercise 3', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	const FRAGRANCE_PRICE = parseEther('10');

	let kilian: KilianExclusive;
	let attackerInitialETHBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await getSigners();

		attackerInitialETHBalance = await provider.getBalance(attacker.address);

		kilian = await deployContract('KilianExclusive');

		// Add THE LIQUORS fragrances
		await kilian.addFragrance('Apple Brandy');
		await kilian.addFragrance("Angles' Share");
		await kilian.addFragrance('Roses on Ice');
		await kilian.addFragrance('Lheure Verte');

		// Add THE FRESH fragrances
		await kilian.addFragrance('Moonligh in Heaven');
		await kilian.addFragrance('Vodka on the Rocks');
		await kilian.addFragrance('Flower of Immortality');
		await kilian.addFragrance('Bamboo Harmony');

		await kilian.flipSaleState();
	});

	it('Users are purchasing fragrances', async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		await kilian.connect(user1).purchaseFragrance(1, { value: FRAGRANCE_PRICE });
		await kilian.connect(user1).purchaseFragrance(4, { value: FRAGRANCE_PRICE });

		await kilian.connect(user2).purchaseFragrance(2, { value: FRAGRANCE_PRICE });
		await kilian.connect(user2).purchaseFragrance(3, { value: FRAGRANCE_PRICE });

		await kilian.connect(user3).purchaseFragrance(5, { value: FRAGRANCE_PRICE });
		await kilian.connect(user3).purchaseFragrance(8, { value: FRAGRANCE_PRICE });
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker stole all the ETH from the token sale contract
		let attackerBalance = await provider.getBalance(attacker.address);
		expect(attackerBalance).is.gt(attackerInitialETHBalance + parseEther('10') * 6n - parseEther('0.2'));
	});
});
