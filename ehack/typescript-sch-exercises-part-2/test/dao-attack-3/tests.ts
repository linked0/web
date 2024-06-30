import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DAOToken, Governance, LendingPool, Treasury } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('DAO Attack Exercise 3', function () {
	let deployer: SignerWithAddress, member1: SignerWithAddress, member2: SignerWithAddress, attacker: SignerWithAddress;

	// DAO Tokens
	const DEPLOYER_TOKENS = parseEther('2500000'); // 2.5M Tokens
	const MEMBER_1_TOKENS = parseEther('500000'); // 500K Tokens
	const MEMBER_2_TOKENS = parseEther('1000000'); // 1M Tokens
	const TOKENS_IN_POOL = parseEther('2000000'); // 2M tokens

	// Treasury ETH
	const ETH_IN_TREASURY = parseEther('1500'); // 1500 ETH

	let token: DAOToken;
	let pool: LendingPool;
	let treasury: Treasury;
	let governance: Governance;

	let attackerInitialETHBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, member1, member2, attacker] = await getSigners();

		attackerInitialETHBalance = await provider.getBalance(attacker.address);

		// Deploy and Setup Contracts
		token = await deployContract('DAOToken');
		pool = await deployContract('LendingPool', [token.target]);
		treasury = await deployContract('Treasury');
		governance = await deployContract('Governance', [token.target, treasury.target]);

		await treasury.setGovernance(governance.target);

		// Send ETH to Treasury
		await deployer.sendTransaction({
			to: treasury.target,
			value: ETH_IN_TREASURY,
		});
		expect(await ethers.provider.getBalance(treasury.target)).to.be.equal(ETH_IN_TREASURY);

		// Mint tokens
		await token.mint(deployer.address, DEPLOYER_TOKENS);
		await token.mint(member1.address, MEMBER_1_TOKENS);
		await token.mint(member2.address, MEMBER_2_TOKENS);
		await token.mint(pool.target, TOKENS_IN_POOL);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// No ETH left in treasury
		expect(await provider.getBalance(treasury.target)).to.be.equal('0');

		// Attacker has taken all ETH from treasury
		expect(await provider.getBalance(attacker.address)).to.be.gt(attackerInitialETHBalance + ETH_IN_TREASURY - parseEther('0.2'));
	});
});
