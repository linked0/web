import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { EtherBank } from '../../typechain-types';

const { provider, parseEther, deployContract, getSigners } = ethers;

describe('Reentrancy Exercise 1', function () {
	let deployer: SignerWithAddress,
		user1: SignerWithAddress,
		user2: SignerWithAddress,
		user3: SignerWithAddress,
		user4: SignerWithAddress,
		attacker: SignerWithAddress;

	let USER1_DEPOSIT = parseEther('12');
	let USER2_DEPOSIT = parseEther('6');
	let USER3_DEPOSIT = parseEther('28');
	let USER4_DEPOSIT = parseEther('63');

	let bank: EtherBank;

	let attackerInitialEthBalance: bigint;
	let bankInitialBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user1, user2, user3, user4, attacker] = await getSigners();

		bank = await deployContract('EtherBank');

		await bank.connect(user1).depositETH({ value: USER1_DEPOSIT });
		await bank.connect(user2).depositETH({ value: USER2_DEPOSIT });
		await bank.connect(user3).depositETH({ value: USER3_DEPOSIT });
		await (await bank.connect(user4).depositETH({ value: USER4_DEPOSIT })).wait();

		attackerInitialEthBalance = await provider.getBalance(attacker.address);
		bankInitialBalance = await provider.getBalance(bank.target);

		expect(bankInitialBalance).equals(USER1_DEPOSIT + USER2_DEPOSIT + USER3_DEPOSIT + USER4_DEPOSIT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		let bankBalance = await provider.getBalance(bank.target);
		expect(bankBalance).equals(0);

		let attackerBalance = await provider.getBalance(attacker.address);
		expect(attackerBalance).is.gt(attackerInitialEthBalance + bankInitialBalance - parseEther('0.2'));
	});
});
