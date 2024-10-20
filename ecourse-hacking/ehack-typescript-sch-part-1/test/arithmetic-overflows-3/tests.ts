import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { AIvestICO, IERC20 } from '../../typechain-types';

const { provider, parseEther, getSigners, deployContract } = ethers;

describe('Arithmetic Over/Underflow Exercise 3', function () {
	let deployer: SignerWithAddress,
		investor1: SignerWithAddress,
		investor2: SignerWithAddress,
		investor3: SignerWithAddress,
		attacker: SignerWithAddress;

	// Investment amounts (in ETH)
	const FIRST_INVESTOR_INVESTED = parseEther('520');
	const SECOND_INVESTOR_INVESTED = parseEther('126');
	const THIRD_INVESTOR_INVESTED = parseEther('54');
	const SECOND_INVESTOR_REFUNDED = parseEther('26');

	const TOTAL_INVESTED = FIRST_INVESTOR_INVESTED + SECOND_INVESTOR_INVESTED + THIRD_INVESTOR_INVESTED - SECOND_INVESTOR_REFUNDED;

	let ico: AIvestICO;
	let token: IERC20;
	let initialAttackerBalancer: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, investor1, investor2, investor3, attacker] = await getSigners();

		// Attacker starts with 1 ETH
		await provider.send('hardhat_setBalance', [
			attacker.address,
			'0xDE0B6B3A7640000', // 1 ETH
		]);
		initialAttackerBalancer = await provider.getBalance(attacker.address);
		expect(initialAttackerBalancer).equals(parseEther('1'));

		// Deploy
		ico = await deployContract('AIvestICO');

		// Get Token Contract
		token = await ethers.getContractAt('AIvestToken', await ico.token());
	});

	it('Investments Tests', async function () {
		// Should Fail (no ETH)
		await expect(ico.connect(investor1).buy(FIRST_INVESTOR_INVESTED * 10n)).to.be.revertedWith('wrong ETH amount sent');

		// Should Succeed
		await ico.connect(investor1).buy(FIRST_INVESTOR_INVESTED * 10n, {
			value: FIRST_INVESTOR_INVESTED,
		});
		await ico.connect(investor2).buy(SECOND_INVESTOR_INVESTED * 10n, {
			value: SECOND_INVESTOR_INVESTED,
		});
		await ico.connect(investor3).buy(THIRD_INVESTOR_INVESTED * 10n, {
			value: THIRD_INVESTOR_INVESTED,
		});

		// Tokens and ETH balance checks
		expect(await token.balanceOf(investor1.address)).equals(FIRST_INVESTOR_INVESTED * 10n);
		expect(await token.balanceOf(investor2.address)).equals(SECOND_INVESTOR_INVESTED * 10n);
		expect(await token.balanceOf(investor3.address)).equals(THIRD_INVESTOR_INVESTED * 10n);

		expect(await provider.getBalance(ico.target)).equals(FIRST_INVESTOR_INVESTED + SECOND_INVESTOR_INVESTED + THIRD_INVESTOR_INVESTED);
	});

	it('Refund Tests', async function () {
		// Should Fail (investor doesn't own so many tokens)
		await expect(ico.connect(investor2).refund(SECOND_INVESTOR_INVESTED * 100n)).to.be.revertedWith('ERC20: burn amount exceeds balance');

		// Should succeed
		await ico.connect(investor2).refund(SECOND_INVESTOR_REFUNDED * 10n);

		// Tokens and ETH balance check
		expect(await provider.getBalance(ico.target)).equals(TOTAL_INVESTED);
		expect(await token.balanceOf(investor2.address)).equals((SECOND_INVESTOR_INVESTED - SECOND_INVESTOR_REFUNDED) * 10n);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker should drain all ETH from ICO contract
		expect(await provider.getBalance(ico.target)).equals(0);
		expect(await provider.getBalance(attacker.address)).is.gt(initialAttackerBalancer + TOTAL_INVESTED - parseEther('0.2'));
	});
});
