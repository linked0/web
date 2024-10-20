import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { GalacticGorillas } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('DOS Exercise 4', function () {
	let deployer: SignerWithAddress, user: SignerWithAddress, attacker: SignerWithAddress;

	const MINT_PRICE = parseEther('1'); // 1 ETH

	let nft: GalacticGorillas;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user, attacker] = await getSigners();

		// Attacker balance is 2.5 ETH
		await ethers.provider.send('hardhat_setBalance', [
			attacker.address,
			'0x22B1C8C1227A0000', // 2.5 ETH (ETH -> WEI -> Hexdecimal)
		]);

		// Deploy contracts
		nft = await deployContract('GalacticGorillas');
	});

	it('Success minting tests', async function () {
		let deployerBalanceBefore = await provider.getBalance(deployer.address);
		await nft.connect(user).mint(2, { value: MINT_PRICE * 2n });

		expect(await nft.balanceOf(user.address)).to.equal(2);
		expect(await nft.ownerOf(1)).to.equal(user.address);
		expect(await nft.ownerOf(2)).to.equal(user.address);

		let deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);
		expect(deployerBalanceAfter).to.equal(deployerBalanceBefore + MINT_PRICE * 2n);
	});

	it('Failure minting tests', async function () {
		await expect(nft.connect(user).mint(20)).to.be.revertedWith('wrong _mintAmount');
		await expect(nft.connect(user).mint(1)).to.be.revertedWith('not enough ETH');
		await expect(nft.connect(user).mint(4, { value: MINT_PRICE * 4n })).to.be.revertedWith('exceeded MAX_PER_WALLET');
	});

	it('Pause tests', async function () {
		await expect(nft.connect(user).pause(true)).to.be.revertedWith('Ownable: caller is not the owner');

		await nft.pause(true);
		await expect(nft.connect(user).mint(1, { value: MINT_PRICE })).to.be.revertedWith('contract is paused');

		await nft.pause(false);
		await nft.connect(user).mint(1, { value: MINT_PRICE });
		expect(await nft.balanceOf(user.address)).equals(3);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// User can't mint nfts even though he is eligable for 2 additional mints
		await expect(nft.connect(user).mint(1, { value: MINT_PRICE })).to.be.reverted;
	});
});
