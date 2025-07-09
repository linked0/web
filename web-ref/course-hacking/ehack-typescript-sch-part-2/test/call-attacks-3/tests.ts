import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { CryptoKeeper, CryptoKeeperFactory, DummyERC20 } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther, keccak256, toUtf8Bytes } = ethers;

describe('Calls Attacks Exercise 3', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

	let token: DummyERC20;
	let cryptoKeeperTemplate: CryptoKeeper;
	let cryptoKeeperFactory: CryptoKeeperFactory;
	let cryptoKeeper1: CryptoKeeper, cryptoKeeper2: CryptoKeeper, cryptoKeeper3: CryptoKeeper;

	let attackerInitialBalance: bigint;
	const CALL_OPERATION = 1;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user1, user2, user3, attacker] = await getSigners();

		// Deploy ERC20 Token
		token = await deployContract('DummyERC20', ['Dummy ERC20', 'DToken', parseEther('1000')]);

		// Deploy Template and Factory
		cryptoKeeperTemplate = await deployContract('CryptoKeeper');

		cryptoKeeperFactory = await deployContract('CryptoKeeperFactory', [deployer.address, cryptoKeeperTemplate.target]);

		// User1 creating CryptoKeepers
		const User1Salt = keccak256(toUtf8Bytes(user1.address));
		const cryptoKeeper1Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User1Salt);
		await cryptoKeeperFactory.connect(user1).createCryptoKeeper(User1Salt, [user1.address]);
		cryptoKeeper1 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper1Address);

		// User2 creating CryptoKeepers
		const User2Salt = keccak256(toUtf8Bytes(user2.address));
		const cryptoKeeper2Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User2Salt);
		await cryptoKeeperFactory.connect(user2).createCryptoKeeper(User2Salt, [user2.address]);
		cryptoKeeper2 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper2Address);

		// User3 creating CryptoKeepers
		const User3Salt = keccak256(toUtf8Bytes(user3.address));
		const cryptoKeeper3Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User3Salt);
		await cryptoKeeperFactory.connect(user3).createCryptoKeeper(User3Salt, [user3.address]);
		cryptoKeeper3 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper3Address);

		// Users load their cryptoKeeper with some ETH
		await user1.sendTransaction({
			to: cryptoKeeper1.target,
			value: parseEther('10'),
		});
		await user2.sendTransaction({
			to: cryptoKeeper2.target,
			value: parseEther('10'),
		});
		await user3.sendTransaction({
			to: cryptoKeeper3.target,
			value: parseEther('10'),
		});

		// cryptoKeeper operation works
		cryptoKeeper1.connect(user1).executeWithValue(user2.address, '0x', parseEther('1'), { value: parseEther('1') });
		cryptoKeeper2.connect(user2).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });
		cryptoKeeper3.connect(user3).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });

		// Only operator can manage wallet
		// addOperator fails
		await expect(cryptoKeeper1.connect(user2).addOperator(user2.address)).to.be.revertedWith('Not an operator');
		// executeWithValue fails
		await expect(cryptoKeeper1.connect(user2).executeWithValue(user2.address, '0x', parseEther('1'))).to.be.revertedWith('Not an operator');
		// execute fails
		const TokenFactory = await ethers.getContractFactory('DummyERC20', deployer);
		const callData = TokenFactory.interface.encodeFunctionData('balanceOf', [deployer.address]);
		await expect(cryptoKeeper1.connect(user2).execute(token.target, callData, CALL_OPERATION)).to.be.revertedWith('Not an operator');

		attackerInitialBalance = await provider.getBalance(attacker.address);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker suppose to steal all the ETH from the Crypto Keepers
		expect(await provider.getBalance(cryptoKeeper1.target)).to.eq(0);
		expect(await provider.getBalance(cryptoKeeper2.target)).to.eq(0);
		expect(await provider.getBalance(cryptoKeeper3.target)).to.eq(0);
		expect(await provider.getBalance(attacker.address)).to.be.gt(attackerInitialBalance + parseEther('30') - parseEther('0.2'));
	});
});
