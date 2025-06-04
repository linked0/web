import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

const { parseEther, getSigners, deployContract } = ethers; // you can destructure what you need from ethers like this or write ethers.theThingYouNeed

describe('ERC20 Tokens Exercise 1', function () {
	let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress;

	// Constants
	const DEPLOYER_MINT = parseEther('100000');
	const USERS_MINT = parseEther('5000');
	const FIRST_TRANSFER = parseEther('100');
	const SECOND_TRANSFER = parseEther('1000');

	// Declare variables here so they can be used in all functions
	//
	// let yourContract: YourContract;
	// let initialBalance: bigint;

	before(async function () {
		/** Deployment and minting tests */

		[deployer, user1, user2, user3] = await getSigners();

		// TODO: Contract deployment
		//
		// OPTION 1: If you need to deploy a contract one time
		// let yourContract = await deployContract('YourContract', deployer?);

		// Things to consider: constructor args should be passed as an array e.g. deployContract('YourContract', [arg1, arg2, arg3], deployer?) <-- arg? means that it is optional, by default every contract is deployed by the deployer account.

		// OPTION 2: Contract Factory (if a contract needs to be deployed multiple times from different addresses (e.g. Deploy different NFT tokens from a template contract))

		// Remember to import Typechain types for type-safe contract interactions
		// const YourContractFactory = (await ethers.getContractFactory(
		//     "contracts/erc20-1/YourContract.sol:YourContract",
		//     deployer
		// )) as YourContract__factory; <-- Typechain Type
		//
		// yourContract = await YourContractFactory.deploy(arg1, arg2, arg3);
		//
		// `yourContract` will be of type `YourContract` from Typechain

		// To access the EOA address use account.address and to access the contract address use contract.target

		// Updated hardhat doesn't use bigNumbers anymore, so for math use regular signs +,-,*,/
		//
		// Also you can't do math between numbers and bigInts, so you can put an 'n' after a number to make it a bigInt e.g: parseEther('1') * 10n
		//
		//
		// TODO: Minting

		// TODO: Check Minting
	});

	it('Transfer tests', async function () {
		/** Transfers Tests */
		// TODO: First transfer
		// TODO: Approval & Allowance test
		// TODO: Second transfer
		// TODO: Checking balances after transfer
	});
});
