import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Token } from '../../typechain-types/contracts/flash-loan-attacks-1';
import { PoolA } from '../../typechain-types/contracts/flash-loan-attacks-1/Pool.sol';

const { deployContract, getSigners, parseEther } = ethers;

describe('Flash Loan Attacks Exercise 1', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const POOL_TOKENS = parseEther('100000000'); // 100M tokens

	let token: Token;
	let pool: PoolA;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		// Deploy token & pool
		token = await deployContract('Token');
		pool = await deployContract('PoolA', [token.target]);

		// Transfer tokens to pool
		await token.transfer(pool.target, POOL_TOKENS);

		// Pool should have 100M, attacker should have 0 tokens
		expect(await token.balanceOf(pool.target)).equals(POOL_TOKENS);
		expect(await token.balanceOf(attacker.address)).equals('0');
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker successfully stole all tokens form the pool
		expect(await token.balanceOf(attacker.address)).equals(POOL_TOKENS);
		expect(await token.balanceOf(pool.target)).equals('0');
	});
});
