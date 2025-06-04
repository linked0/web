import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

const { deployContract, getSigners, parseEther, parseUnits } = ethers;

describe('Flash Loans Exercise 3', function () {
	// Should have $4.745M USDC on mainnet block 15969633
	// https://etherscan.io/address/0x8e5dedeaeb2ec54d0508973a0fccd1754586974a
	const IMPERSONATED_ACCOUNT_ADDRESS = '0x8e5dedeaeb2ec54d0508973a0fccd1754586974a';
	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const WETH_USDC_PAIR = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc';

	// $40M USDC
	const BORROW_AMOUNT = parseUnits('40000000', 6);
	// Uniswap V2 fee is 0.3% which is $1.2M USDC
	const FEE_AMOUNT = (BORROW_AMOUNT * 3n) / 997n + 1n;

	it('Uniswap V2 Flash Swap', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Get contract objects for relevant On-Chain contracts
		// TODO: Deploy Flash Swap contract
		// TODO: Send USDC to contract for fees
		// TODO: Execute successfully a Flash Swap of $40,000,000 (USDC)
	});
});
