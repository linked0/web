import { ethers } from 'hardhat';
import { expect } from 'chai';
import { mine } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DummyERC20, TwoStepExchange } from '../../typechain-types';

const { provider, deployContract, getSigners, parseUnits } = ethers;

describe('Gas Manipulation Exercise 1', function () {
	/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
	let keeper: SignerWithAddress,
		attacker: SignerWithAddress,
		exchange: TwoStepExchange,
		weth: DummyERC20,
		usdc: DummyERC20,
		orderCreationBlockNumber: number;

	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	const ORDER_CREATION_PRICE = parseUnits('5000', 6); // 5,000 USDC per ETH

	const getKeeperPriceParams = (price: bigint, blockNumber: number) => {
		return { price, blockNumber };
	};

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[keeper, attacker] = await getSigners();

		weth = (await ethers.getContractAt('contracts/interfaces/IWETH9.sol:IWETH9', WETH_ADDRESS)) as unknown as DummyERC20;
		usdc = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADDRESS)) as unknown as DummyERC20;

		exchange = await deployContract('TwoStepExchange', keeper);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
		// TODO: Implement your AttackContract and then deploy it
		// TODO: Create a malicious order on the Exchange

		// Get the order creation block number
		orderCreationBlockNumber = await provider.getBlockNumber();
		// The keeper attempts to execute the order, but cannot
		await expect(exchange.connect(keeper).executeSwapOrder(1, getKeeperPriceParams(ORDER_CREATION_PRICE, orderCreationBlockNumber))).to.be.reverted;
		// 100 blocks have gone by and the price of Ether has appreciated to $6,000
		await mine(100);
		// TODO: Execute the exploit!
	});

	after(async function () {
		// Now the keeper successfully executes the order.
		// Why was this an exploit? What were you able to do?
		await expect(exchange.connect(keeper).executeSwapOrder(1, getKeeperPriceParams(ORDER_CREATION_PRICE, orderCreationBlockNumber)))
			.to.emit(exchange, 'SwapOrderExecuted')
			.withArgs(1, ORDER_CREATION_PRICE);
	});
});
