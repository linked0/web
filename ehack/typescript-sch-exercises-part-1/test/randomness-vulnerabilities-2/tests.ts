import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Game2 } from '../../typechain-types';

const { provider, parseEther, getSigners, deployContract } = ethers;

describe('Randomness Vulnerabilities Exercise 2', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const INITIAL_POT = parseEther('20');
	const GAME_FEE = parseEther('1');

	let game: Game2;

	let attackerInitialBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();
		attackerInitialBalance = await provider.getBalance(attacker.address);

		// Deploy wallet and deposit ETH
		game = await deployContract('Game2', { value: INITIAL_POT });

		let inGame = await provider.getBalance(game.target);
		expect(inGame).to.equal(INITIAL_POT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Game funds were stolen
		expect(await provider.getBalance(game.target)).equals(0);

		// Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
		expect(await provider.getBalance(attacker.address)).is.gt(attackerInitialBalance + INITIAL_POT - parseEther('0.2'));
	});
});
