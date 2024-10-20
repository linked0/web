import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Game } from '../../typechain-types';

const { provider, parseEther, getSigners, deployContract } = ethers;

describe('Randomness Vulnerabilites Exercise 1', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;
	const GAME_POT = parseEther('10'); // 10 ETH

	let game: Game;

	let attackerInitialBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();
		attackerInitialBalance = await provider.getBalance(attacker.address);

		// Deploy wallet and deposit 10 ETH
		game = await deployContract('Game', { value: GAME_POT });

		let inGame = await provider.getBalance(game.target);
		expect(inGame).to.equal(GAME_POT);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Game funds were stolen
		expect(await provider.getBalance(game.target)).equals(0);

		// Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
		expect(await provider.getBalance(attacker.address)).is.gt(attackerInitialBalance + GAME_POT - parseEther('0.2'));
	});
});
