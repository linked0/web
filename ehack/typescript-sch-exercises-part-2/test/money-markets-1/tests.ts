import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

import { IERC20 } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther, parseUnits } = ethers;

describe('DEFI Crash Course: Money Markets Exercise 1 - Aave V3', function () {
	/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
	let user: SignerWithAddress;

	const AAVE_POOL = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2';
	const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
	const WHALE = '0xf977814e90da44bfa03b6295a0616a897441acec';

	// AAVE USDC Receipt Token
	const A_USDC = '0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c';
	// AAVE DAI Variable Debt Token
	const VARIABLE_DEBT_DAI = '0xcF8d0c70c850859266f5C338b38F9D663181C314';

	const USER_USDC_BALANCE = parseUnits('100000', 6);
	const AMOUNT_TO_DEPOSIT = parseUnits('1000', 6);
	const AMOUNT_TO_BORROW = parseUnits('100', 18);

	let usdc: IERC20;
	let dai: IERC20;
	let aUSDC: IERC20;
	let debtDAI: IERC20;

	before(async () => {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[user] = await getSigners();

		// Load tokens
		usdc = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC, user)) as unknown as IERC20;
		dai = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', DAI, user)) as unknown as IERC20;
		aUSDC = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', A_USDC, user)) as unknown as IERC20;
		debtDAI = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', VARIABLE_DEBT_DAI, user)) as unknown as IERC20;

		// Whale impersonation
		const whaleSigner = await ethers.getImpersonatedSigner(WHALE);

		// Set user & whale balance to 2 ETH
		await provider.send('hardhat_setBalance', [
			user.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			whaleSigner.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);

		// Transfer USDC to the user
		await usdc.connect(whaleSigner).transfer(user.address, USER_USDC_BALANCE);
		// Burn DAI balance form the user (somehow this signer has DAI on mainnet lol)
		await dai.connect(user).transfer('0x000000000000000000000000000000000000dEaD', await dai.balanceOf(user.address));
	});

	it('Student Tests', async () => {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Deploy AaveUser contract
		// TODO: Appove and deposit 1000 USDC tokens
		// TODO: Validate that the depositedAmount state var was changed
		// TODO: Validate that your contract received the aUSDC tokens (receipt tokens)
		// TODO: borrow 100 DAI tokens
		// TODO: Validate that the borrowedAmount state var was changed
		// TODO: Validate that the user received the DAI Tokens
		// TODO: Validate that your contract received the DAI variable debt tokens
		// TODO: Repay all the DAI
		// TODO: Validate that the borrowedAmount state var was changed
		// TODO: Validate that the user doesn't own the DAI tokens
		// TODO: Validate that your contract own much less DAI Variable debt tokens (less then 0.1% of borrowed amount)
		// Note: The contract still supposed to own some becuase of negative interest
		// TODO: Withdraw all your USDC
		// TODO: Validate that the depositedAmount state var was changed
		// TODO: Validate that the user got the USDC tokens back
		// TODO: Validate that your contract own much less aUSDC receipt tokens (less then 0.1% of deposited amount)
		// Note: The contract still supposed to own some becuase of the positive interest
	});
});
