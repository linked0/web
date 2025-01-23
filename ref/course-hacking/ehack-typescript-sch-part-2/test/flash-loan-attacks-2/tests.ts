import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { AdvancedVault } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Flash Loan Attacks Exercise 2', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const ETH_IN_VAULT = parseEther('1000'); // 1000 ETH

	let vault: AdvancedVault;

	let attackerInitialBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, attacker] = await getSigners();

		vault = await deployContract('AdvancedVault');

		await vault.depositETH({ value: ETH_IN_VAULT });

		attackerInitialBalance = await provider.getBalance(attacker.address);

		expect(await provider.getBalance(vault.target)).equals(ETH_IN_VAULT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		expect(await provider.getBalance(vault.target)).equals('0');

		// -0.2ETH for tx fees
		expect(await provider.getBalance(attacker.address)).is.gt(attackerInitialBalance + ETH_IN_VAULT - parseEther('0.2'));
	});
});
