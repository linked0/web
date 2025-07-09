import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

const { deployContract, getSigners, parseEther } = ethers;

describe('Flash Loan Exercise 1', function () {
	let deployer: SignerWithAddress, user: SignerWithAddress;

	const POOL_BALANCE = parseEther('1000');

	it('Flash Loan Tests', async function () {
		[deployer, user] = await getSigners();

		/** CODE YOUR SOLUTION HERE */
		// TODO: Deploy Pool.sol contract with 1,000 ETH
		// TODO: Deploy Receiver.sol contract
		// TODO: Successfuly execute a Flash Loan of all the balance using Receiver.sol contract
		// TODO: Deploy GreedyReceiver.sol contract
		// TODO: Fails to execute a flash loan with GreedyReceiver.sol contract
	});
});
