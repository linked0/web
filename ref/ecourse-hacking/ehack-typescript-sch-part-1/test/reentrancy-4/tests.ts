import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { CryptoEmpireGame, CryptoEmpireToken } from '../../typechain-types';

const { deployContract, getSigners } = ethers;

describe('Reentrancy Exercise 4', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, attacker: SignerWithAddress;

	let cryptoEmpireToken: CryptoEmpireToken;
	let cryptoEmpireGame: CryptoEmpireGame;

	before(async function () {
		[deployer, user1, user2, attacker] = await getSigners();

		cryptoEmpireToken = await deployContract('CryptoEmpireToken');
		cryptoEmpireGame = await deployContract('CryptoEmpireGame', [cryptoEmpireToken.target]);

		// Giving 1 NFT to each user
		await cryptoEmpireToken.mint(user1.address, 1, 0);
		await cryptoEmpireToken.mint(user2.address, 1, 1);
		await cryptoEmpireToken.mint(attacker.address, 1, 2);

		// The CryptoEmpire game gained many users already and has some NFTs either staked or listed in it
		for (let i = 0; i <= 5; i++) {
			await cryptoEmpireToken.mint(cryptoEmpireGame.target, 20, i);
		}
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		// Attacker stole all the tokens from the game contract
		expect(await cryptoEmpireToken.balanceOf(attacker.address, 2)).is.at.least(20);
		expect(await cryptoEmpireToken.balanceOf(cryptoEmpireGame.target, 2)).equals(0);
	});
});
