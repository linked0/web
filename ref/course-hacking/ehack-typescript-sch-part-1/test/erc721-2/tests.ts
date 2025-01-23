import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DummyERC721, DummyERC721__factory } from '../../typechain-types';

const { provider, parseEther, deployContract, getSigners } = ethers;

describe('ERC721 Tokens Exercise 2', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;

	const CUTE_NFT_PRICE = parseEther('5');
	const BOOBLES_NFT_PRICE = parseEther('7');

	let cuteNFT: DummyERC721;
	let booblesNFT: DummyERC721;
	// let yourContract: YourContract

	let user1InitialBalance: bigint;
	let user2InitialBalance: bigint;
	let user3InitialBalance: bigint;

	before(async function () {
		/** Deployment and minting tests */

		[deployer, user1, user2, user3] = await getSigners();

		// User1 creates his own NFT collection
		let NFTFactory = (await ethers.getContractFactory('DummyERC721', user1)) as DummyERC721__factory;
		cuteNFT = await NFTFactory.deploy('Crypto Cuties', 'CUTE', 1000);

		await cuteNFT.mintBulk(30);
		expect(await cuteNFT.balanceOf(user1.address)).to.equal(30);

		// User3 creates his own NFT collection
		NFTFactory = await ethers.getContractFactory('DummyERC721', user3);
		booblesNFT = await NFTFactory.deploy('Rare Boobles', 'BOO', 10000);
		await booblesNFT.mintBulk(120);
		expect(await booblesNFT.balanceOf(user3.address)).equals(120);

		// Store users initial balance
		user1InitialBalance = await provider.getBalance(user1.address);
		user2InitialBalance = await provider.getBalance(user2.address);
		user3InitialBalance = await provider.getBalance(user3.address);
	});

	it('Deployment & Listing Tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Deploy Marketplace from deployer
		// TODO: User1 lists Cute NFT tokens 1-10 for 5 ETH each
		// TODO: Check that Marketplace owns 10 Cute NFTs
		// TODO: Checks that the marketplace mapping is correct (All data is correct), check the 10th item.
		// TODO: User3 lists Boobles NFT tokens 1-5 for 7 ETH each
		// TODO: Check that Marketplace owns 5 Booble NFTs
		// TODO: Checks that the marketplace mapping is correct (All data is correct), check the 15th item.
	});

	it('Purchases Tests', async function () {
		/** CODE YOUR SOLUTION HERE */
		// All Purchases From User2 //
		// TODO: Try to purchase itemId 100, should revert
		// TODO: Try to purchase itemId 3, without ETH, should revert
		// TODO: Try to purchase itemId 3, with ETH, should work
		// TODO: Can't purchase sold item
		// TODO: User2 owns itemId 3 -> Cuties tokenId 3
		//
		// TODO: User1 got the right amount of ETH for the sale
		// (for all math operations use regular signs +/- instead of add(), sub() that was needed for the older verison of ethers
		//
		// TODO: Purchase itemId 11
		// TODO: User2 owns itemId 11 -> Boobles tokenId 1
		// TODO: User3 got the right amount of ETH for the sale
	});
});
