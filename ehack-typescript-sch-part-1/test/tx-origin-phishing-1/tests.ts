import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { SimpleSmartWallet } from '../../typechain-types';

const { provider, parseEther, deployContract, getSigners } = ethers;

describe('TX Origin Phishing Exercise 1', function () {
	let fundManager: SignerWithAddress, attacker: SignerWithAddress;

	const HEDGE_FUND_DEPOSIT = parseEther('2800'); // 2800 ETH
	const CHARITY_DONATION = parseEther('0.1'); // 0.1 ETH

	let walletContract: SimpleSmartWallet;
	let attackerContract: any; // TODO - Replace "any" with your contract type

	let attackerInitialEthBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[fundManager, attacker] = await getSigners();

		attackerInitialEthBalance = await provider.getBalance(attacker.address);

		walletContract = await deployContract('SimpleSmartWallet', { value: HEDGE_FUND_DEPOSIT });

		let smartWalletBalance = await provider.getBalance(walletContract.target);
		expect(smartWalletBalance).equals(HEDGE_FUND_DEPOSIT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Fund manager is tricked to send a donation to the "charity" (attacker's contract)
		await fundManager.sendTransaction({
			to: attackerContract.address,
			value: CHARITY_DONATION,
		});

		// Smart wallet supposed to be emptied
		let walletBalance = await provider.getBalance(walletContract.target);
		expect(walletBalance).equals(0);

		// Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
		expect(await provider.getBalance(attacker.address)).is.gt(attackerInitialEthBalance + HEDGE_FUND_DEPOSIT - parseEther('0.2'));
	});
});
