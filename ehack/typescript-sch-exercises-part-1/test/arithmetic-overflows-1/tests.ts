import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { TimeLock } from '../../typechain-types';

const { provider, parseEther, getSigners, deployContract } = ethers;

describe('Arithmetic Over/Underflow Exercise 1', function () {
	let deployer: SignerWithAddress, victim: SignerWithAddress, attacker: SignerWithAddress;

	const ONE_MONTH = 30 * 24 * 60 * 60;
	const VICTIM_DEPOSIT = parseEther('100');

	let timelock: TimeLock;
	let attackerInitialBalance: bigint;
	let victimInitialBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, victim, attacker] = await getSigners();
		attackerInitialBalance = await provider.getBalance(attacker.address);
		victimInitialBalance = await provider.getBalance(victim.address);

		timelock = await deployContract('TimeLock');

		await timelock.connect(victim).depositETH({ value: VICTIM_DEPOSIT });
		let currentBalance = await provider.getBalance(victim.address);
		expect(currentBalance).to.be.lt(victimInitialBalance - VICTIM_DEPOSIT);

		let block = await provider.getBlock(await provider.getBlockNumber());
		let blockTimestmap = block?.timestamp;

		let victimDeposited = await timelock.connect(victim).getBalance(victim.address);
		let lockTime = await timelock.connect(victim).getLockTime(victim.address);

		expect(victimDeposited).equals(VICTIM_DEPOSIT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Timelock contract victim's balance supposed to be 0 (withdrawn successfuly)
		let victimDepositedAfter = await timelock.connect(victim).getBalance(victim.address);
		expect(victimDepositedAfter).equals(0);

		// Attacker's should steal successfully the 100 ETH (-0.2 ETH becuase TX fees)
		let attackerCurrentBalance = await provider.getBalance(attacker.address);
		expect(attackerCurrentBalance).is.gt(attackerInitialBalance + VICTIM_DEPOSIT - parseEther('0.2'));
	});
});
