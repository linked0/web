import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

const { deployContract, getSigners, getContractAt, parseEther, parseUnits } = ethers;

describe('Flash Loans Exercise 2', function () {
	// Should have $4.745M USDC on mainnet block 15969633
	// https://etherscan.io/address/0x8e5dedeaeb2ec54d0508973a0fccd1754586974a
	const IMPERSONATED_ACCOUNT_ADDRESS = '0x8e5dedeaeb2ec54d0508973a0fccd1754586974a';
	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const AAVE_LENDING_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';

	// $100M USDC
	const BORROW_AMOUNT = parseUnits('100000000', 6);
	// AAVE flash loan fee is 0.09% --> $90K USDC
	const FEE_AMOUNT = parseUnits('90000', 6);

	it('AAVE V3 Flash Loan', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Get contract objects for relevant On-Chain contracts
		// TODO: Deploy Flash Loan contract
		// TODO: Send USDC to contract for fees
		// TODO: Execute successfully a Flash Loan of $100,000,000 (USDC)
	});
});
