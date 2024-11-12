import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { TheGridDAO, TheGridTreasury } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('DAO Attack Exercise 2', function () {
	let deployer: SignerWithAddress, daoMember1: SignerWithAddress, daoMember2: SignerWithAddress, attacker: SignerWithAddress, user: SignerWithAddress;

	// Governance Tokens
	const DEPLOYER_TOKENS = parseEther('1500'); // 10 million tokens
	const DAO_MEMBER_TOKENS = parseEther('1000'); // 10 million tokens
	const ATTACKER_TOKENS = parseEther('10'); // 10 million tokens

	// ETH Balances
	const ETH_IN_TREASURY = parseEther('1000'); // 1000 ETH in revenue

	// Proposals
	const FIRST_PROPOSAL_AMOUNT = parseEther('0.1'); // 0.1 ETH
	const SECOND_PROPOSAL_AMOUNT = parseEther('1'); // 0.1 ETH

	let dao: TheGridDAO;
	let treasury: TheGridTreasury;

	let attackerInitialETHBalance: bigint;

	let treasuryBalanceAfterFirstProposal: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, daoMember1, daoMember2, attacker, user] = await getSigners();

		attackerInitialETHBalance = await provider.getBalance(attacker.address);

		// Deploy and Setup Contracts
		dao = await deployContract('TheGridDAO');
		treasury = await deployContract('TheGridTreasury', [dao.target]);

		await dao.setTreasury(treasury.target);

		// ETH to Treasury
		await deployer.sendTransaction({
			to: treasury.target,
			value: ETH_IN_TREASURY,
		});
		expect(await provider.getBalance(treasury.target)).to.be.equal(ETH_IN_TREASURY);

		// Mint tokens
		await dao.mint(deployer.address, DEPLOYER_TOKENS);
		await dao.mint(daoMember1.address, DAO_MEMBER_TOKENS);
		await dao.mint(daoMember2.address, DAO_MEMBER_TOKENS);
		await dao.mint(attacker.address, ATTACKER_TOKENS);
	});

	it('Governance Test', async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		// Random user can't propose
		await expect(dao.connect(user).propose(user.address, ETH_IN_TREASURY)).to.be.revertedWith("You don't have voting power");

		// Depoyer proposes 2 proposals
		await dao.propose(deployer.address, FIRST_PROPOSAL_AMOUNT);
		await dao.propose(deployer.address, SECOND_PROPOSAL_AMOUNT);

		// Random user can't vote
		await expect(dao.connect(user).vote(1, false)).to.be.reverted;

		// DAO Members can vote
		// First proposal should go through (Yes - 2500, No - 1000)
		await dao.connect(daoMember1).vote(1, true);
		// Can't vote twice on same proposal
		await expect(dao.connect(daoMember1).vote(1, false)).to.be.reverted;
		await dao.connect(daoMember2).vote(1, false);

		// Second proposal should fail (Yes - 1500, No - 2000)
		await dao.connect(daoMember1).vote(2, false);
		await dao.connect(daoMember2).vote(2, false);

		// Can't execute before voting is over
		await expect(dao.execute(1)).to.be.revertedWith('Voting is not over');

		// Advance time 1 day so we can try proposal execution
		await provider.send('evm_increaseTime', [1 * 24 * 60 * 60]); // 1 day

		// First proposal should succeed - tresury balance changed
		await dao.execute(1);
		treasuryBalanceAfterFirstProposal = ETH_IN_TREASURY - FIRST_PROPOSAL_AMOUNT;
		expect(await provider.getBalance(treasury.target)).to.equal(treasuryBalanceAfterFirstProposal);

		// Second proposal should fail - tresury balance did't change
		await dao.execute(2);
		expect(await provider.getBalance(treasury.target)).to.equal(treasuryBalanceAfterFirstProposal);

		// Both proposal processed
		let proposal1 = await dao.getProposal(1);
		let proposal2 = await dao.getProposal(2);
		expect(proposal1.processed).to.equal(true);
		expect(proposal2.processed).to.equal(true);

		// Can't execute processed proposal
		await expect(dao.execute(2)).to.be.revertedWith('Proposal already processed');
	});

	it('Pre-Exploit', async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		// Create a proposal to send all trasury balance to Attacker
		await dao.connect(attacker).propose(attacker.address, treasuryBalanceAfterFirstProposal);
	});

	it('Exploit', async function () {
		/** CODE YOUR EXPLOIT HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS - DON'T CHANGE ANYTHING HERE */

		// Other DAO Members vote "no" on the attacker's proposal
		await dao.connect(deployer).vote(3, false);
		await dao.connect(daoMember1).vote(3, false);
		await dao.connect(daoMember2).vote(3, false);

		// Fast forward EVM 1 day so proposal can be executed
		await provider.send('evm_increaseTime', [1 * 24 * 60 * 60]); // 1 day
		// Attacker is trying to execute proposal
		await dao.connect(attacker).execute(3);

		// No ETH left in treasury
		expect(await provider.getBalance(treasury.target)).to.be.equal('0');

		// Attacker stole all ETH from the treasury
		expect(await provider.getBalance(attacker.address)).to.be.gt(attackerInitialETHBalance + treasuryBalanceAfterFirstProposal - parseEther('20'));
	});
});
