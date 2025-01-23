import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { BlockSafe, BlockSafeFactory, DummyERC20 } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther, keccak256, toUtf8Bytes } = ethers;

describe('Calls Attacks Exercise 4', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	let token: DummyERC20;
	let blockSafeTemplate: BlockSafe;
	let blockSafeFactory: BlockSafeFactory;
	let blockSafe1: BlockSafe, blockSafe2: BlockSafe, blockSafe3: BlockSafe;

	let attackerInitialBalance: bigint;
	const CALL_OPERATION = 1;
	const DELEGATECALL_OPERATION = 2;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user1, user2, user3, attacker] = await getSigners();

		// Deploy ERC20 Token
		token = await deployContract('DummyERC20', ['Dummy ERC20', 'DToken', parseEther('1000')]);

		// Deploy Template and Factory
		blockSafeTemplate = await deployContract('BlockSafe');
		blockSafeFactory = await deployContract('BlockSafeFactory', [deployer.address, blockSafeTemplate.target]);

		// User1 creating CryptoKeepers
		const User1Salt = keccak256(toUtf8Bytes(user1.address));
		const blockSafe1Address = await blockSafeFactory.predictBlockSafeAddress(User1Salt);
		await blockSafeFactory.connect(user1).createBlockSafe(User1Salt, [user1.address]);
		blockSafe1 = (await ethers.getContractAt('contracts/call-attacks-4/BlockSafe.sol:BlockSafe', blockSafe1Address)) as unknown as BlockSafe;

		// User2 creating CryptoKeepers
		const User2Salt = keccak256(toUtf8Bytes(user2.address));
		const blockSafe2Address = await blockSafeFactory.predictBlockSafeAddress(User2Salt);
		await blockSafeFactory.connect(user2).createBlockSafe(User2Salt, [user2.address]);
		blockSafe2 = (await ethers.getContractAt('contracts/call-attacks-4/BlockSafe.sol:BlockSafe', blockSafe2Address)) as unknown as BlockSafe;

		// User3 creating CryptoKeepers
		const User3Salt = keccak256(toUtf8Bytes(user3.address));
		const blockSafe3Address = await blockSafeFactory.predictBlockSafeAddress(User3Salt);
		await blockSafeFactory.connect(user3).createBlockSafe(User3Salt, [user3.address]);
		blockSafe3 = (await ethers.getContractAt('contracts/call-attacks-4/BlockSafe.sol:BlockSafe', blockSafe3Address)) as unknown as BlockSafe;

		// Users load their Block Safe with some ETH
		await user1.sendTransaction({
			to: blockSafe1.target,
			value: parseEther('10'),
		});
		await user2.sendTransaction({
			to: blockSafe2.target,
			value: parseEther('10'),
		});
		await user3.sendTransaction({
			to: blockSafe3.target,
			value: parseEther('10'),
		});

		// Block Safe operation works
		blockSafe1.connect(user1).executeWithValue(user2.address, '0x', parseEther('1'), { value: parseEther('1') });
		blockSafe2.connect(user2).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });
		blockSafe3.connect(user3).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });

		// Only operator can manage wallet
		// addOperator fails
		await expect(blockSafe1.connect(user2).addOperator(user2.address)).to.be.revertedWith('Not an operator');
		// executeWithValue fails
		await expect(blockSafe1.connect(user2).executeWithValue(user2.address, '0x', parseEther('1'))).to.be.revertedWith('Not an operator');
		// execute fails
		const TokenFactory = await ethers.getContractFactory('contracts/utils/DummyERC20.sol:DummyERC20', deployer);
		const callData = TokenFactory.interface.encodeFunctionData('balanceOf', [deployer.address]);
		await expect(blockSafe1.connect(user2).execute(token.target, callData, CALL_OPERATION)).to.be.revertedWith('Not an operator');

		attackerInitialBalance = await provider.getBalance(attacker.address);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// All safes should be non functional and frozen
		// And we can't withdraw ETH from the safes
		let safe1BalanceBefore = await provider.getBalance(blockSafe1.target);
		await blockSafe1.connect(user1).executeWithValue(user1.address, '0x', parseEther('10'));
		expect(await provider.getBalance(blockSafe1.target)).to.eq(safe1BalanceBefore);

		let safe2BalanceBefore = await provider.getBalance(blockSafe2.target);
		await blockSafe2.connect(user2).executeWithValue(user2.address, '0x', parseEther('10'));
		expect(await provider.getBalance(blockSafe2.target)).to.eq(safe2BalanceBefore);

		let safe3BalanceBefore = await provider.getBalance(blockSafe3.target);
		await blockSafe3.connect(user3).executeWithValue(user3.address, '0x', parseEther('10'));
		expect(await provider.getBalance(blockSafe3.target)).to.eq(safe3BalanceBefore);
	});
});
