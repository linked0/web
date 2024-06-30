import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { GoldExchange, GoldOracle, GoldToken } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther } = ethers;

describe('Oracle Manipulation Exercise 1', function () {
	const sources = [
		'0x4aC89064Fa0d03De57f802feC722925b4502572A',
		'0x96574c0392112CbEe134eb77e76A183d54A7c18f',
		'0xA7804BB057EBB7D0c0a3C7F4B8710AE854525fd4',
	];

	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	const EXCHANGE_INITIAL_BALANCE = parseEther('1800');
	const INITIAL_GOLD_PRICE = parseEther('1.5');

	let token: GoldToken;
	let oracle: GoldOracle;
	let exchange: GoldExchange;

	let initialAttackerBalance: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		// Attacker starts with 1 ETH
		await provider.send('hardhat_setBalance', [
			attacker.address,
			'0xDE0B6B3A7640000', // 1 ETH
		]);
		expect(await provider.getBalance(attacker.address)).equals(parseEther('1'));
		initialAttackerBalance = await provider.getBalance(attacker.address);

		// Sources starts with 10 ETH
		for (let i = 0; i < sources.length; i++) {
			await provider.send('hardhat_setBalance', [
				sources[i],
				'0x8AC7230489E80000', // 10 ETH
			]);
			expect(await provider.getBalance(sources[i])).equals(parseEther('10'));
		}

		// Deploy contracts
		token = await deployContract('GoldToken');

		oracle = await deployContract('GoldOracle', [sources, [INITIAL_GOLD_PRICE, INITIAL_GOLD_PRICE, INITIAL_GOLD_PRICE]]);

		exchange = await deployContract('GoldExchange', [token.target, oracle.target], {
			value: EXCHANGE_INITIAL_BALANCE,
		});

		// Transfer token ownership to exchange
		await token.transferOwnership(exchange.target);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Exchange lost almost all ETH
		expect(await provider.getBalance(exchange.target)).is.lt(parseEther('0.1'));

		// Attacker's earned a lot of ETH on top of the exchange
		expect(await provider.getBalance(attacker.address)).is.gt(initialAttackerBalance + EXCHANGE_INITIAL_BALANCE - parseEther('0.2'));

		// Gold price shouldn't have changed
		expect(await oracle.getPrice()).equals(INITIAL_GOLD_PRICE);
	});
});
