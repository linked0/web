import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ProtocolVault } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Access Control Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	const USER_DEPOSIT = parseEther('10');

	let protocolVault: ProtocolVault;
	let attackerInitialETHBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, attacker] = await getSigners();

		attackerInitialETHBalance = await provider.getBalance(attacker.address);

		protocolVault = await deployContract('ProtocolVault');

		await user1.sendTransaction({
			to: protocolVault.target,
			value: USER_DEPOSIT,
		});
		await user2.sendTransaction({
			to: protocolVault.target,
			value: USER_DEPOSIT,
		});
		await user3.sendTransaction({
			to: protocolVault.target,
			value: USER_DEPOSIT,
		});

		let currentBalance = await provider.getBalance(protocolVault.target);
		expect(currentBalance).equals(USER_DEPOSIT * 3n);
		await expect(protocolVault.connect(attacker).withdrawETH()).to.be.reverted;
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Protocol Vault is empty and attacker has ~30+ ETH
		expect(await provider.getBalance(protocolVault.target)).equals(0);
		expect(await provider.getBalance(attacker.address)).is.gt(attackerInitialETHBalance + USER_DEPOSIT * 3n - parseEther('0.2'));
	});
});
