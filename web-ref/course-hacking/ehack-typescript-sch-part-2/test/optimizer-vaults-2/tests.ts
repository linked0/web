import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DummyERC20, OptimizerStrategy, OptimizerVault, YieldContract } from '../../typechain-types';

const { provider, deployContract, getSigners, parseEther, parseUnits } = ethers;

describe('Optimizer Vaults 101: Exercise 2 - Owner Rug Pull', () => {
	/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
	let owner: SignerWithAddress, bob: SignerWithAddress, alice: SignerWithAddress;
	let usdc: DummyERC20, yieldContract: YieldContract, strategy: OptimizerStrategy, vault: OptimizerVault;

	const BOB_USDC_BALANCE = parseUnits('100000', 6); // Bob has 100,000 USDC
	const ALICE_USDC_BALANCE = parseUnits('200000', 6); // Alice has 200,000 USDC

	const USDC_ADRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const WHALE_ADDRESS = '0xf977814e90da44bfa03b6295a0616a897441acec';

	before(async () => {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[owner, alice, bob] = await getSigners();

		// Load tokens
		usdc = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADRESS, owner)) as unknown as DummyERC20;

		// Whale impersonation
		const whaleSigner = await ethers.getImpersonatedSigner(WHALE_ADDRESS);

		// Set bob, alice & whale balance to 2 ETH
		await provider.send('hardhat_setBalance', [
			bob.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			alice.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			whaleSigner.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);

		// Transfer USDC to bob & alice
		await usdc.connect(whaleSigner).transfer(alice.address, ALICE_USDC_BALANCE);
		await usdc.connect(whaleSigner).transfer(bob.address, BOB_USDC_BALANCE);

		// Deploy the vault system
		yieldContract = await deployContract('YieldContract', [USDC_ADRESS]);
		strategy = await deployContract('OptimizerStrategy', [yieldContract.target]);
		vault = await deployContract('OptimizerVault', [strategy.target, 'VAULT', 'VLT']);

		// Assign the vault to the strategy
		await strategy.setVault(vault.target);

		// Approve the vault for the bob & alice
		await usdc.connect(alice).approve(vault.target, ALICE_USDC_BALANCE);
		await usdc.connect(bob).approve(vault.target, BOB_USDC_BALANCE);

		// Alice & Bob deposit their USDC into the vault
		await vault.connect(bob).deposit(BOB_USDC_BALANCE);
		await vault.connect(alice).deposit(ALICE_USDC_BALANCE);
	});

	it('Exploit', async () => {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async () => {
		/** SUCCESS CONDITIONS */

		const ruggedAmount = BOB_USDC_BALANCE + ALICE_USDC_BALANCE;
		const withdrawalFees = (ruggedAmount * 10n) / 1000n;

		// The strategy is now empty except for withdrawal fees
		expect(await strategy.balanceOf()).equals(withdrawalFees);

		// The owner now holds the rugged USDC minus withdrawalFees
		expect(await usdc.balanceOf(owner.address)).equals(ruggedAmount - withdrawalFees);
	});
});
