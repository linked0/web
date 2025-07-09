import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { Chocolate, IERC20 } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('DEFI Money Markets: DEX Exercise 1 - Chocolate Factory', function () {
	let deployer: SignerWithAddress, user: SignerWithAddress;

	const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
	const RICH_SIGNER = '0x8eb8a3b98659cce290402893d0123abb75e3ab28';
	const ETH_BALANCE = parseEther('300');

	const INITIAL_MINT = parseEther('1000000');
	const INITIAL_LIQUIDITY = parseEther('100000');
	const ETH_IN_LIQUIDITY = parseEther('100');

	let richSigner: SignerWithAddress;

	let weth: IERC20;

	let chocolate: Chocolate;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, user] = await getSigners();

		// Send ETH from rich signer to our deployer
		richSigner = await ethers.getImpersonatedSigner(RICH_SIGNER);
		await richSigner.sendTransaction({
			to: deployer.address,
			value: ETH_BALANCE,
		});

		weth = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', WETH_ADDRESS)) as unknown as IERC20;
	});

	it('Deployment', async function () {
		// TODO: Deploy your smart contract to `chocolate`, mint 1,000,000 tokens to deployer
		// TODO: Print newly created pair address and store pair contract to `pair`
	});

	it('Deployer add liquidity tests', async function () {
		// TODO: Add liquidity of 100,000 tokens and 100 ETH (1 token = 0.001 ETH)
		// TODO: Print the amount of LP tokens that the deployer owns
	});

	it('User swap tests', async function () {
		let userChocolateBalance = await chocolate.balanceOf(user.address);
		let userWETHBalance = await weth.balanceOf(user.address);

		// TODO: From user: Swap 10 ETH to Chocolate

		// TODO: Make sure user received the chocolates (greater amount than before)

		// TODO: From user: Swap 100 Chocolates to ETH

		// TODO: Make sure user received the WETH (greater amount than before)
	});

	it('Deployer remove liquidity tests', async function () {
		let deployerChocolateBalance = await chocolate.balanceOf(deployer.address);
		let deployerWETHBalance = await weth.balanceOf(deployer.address);

		// TODO: Remove 50% of deployer's liquidity

		// TODO: Make sure deployer owns 50% of the LP tokens (leftovers)

		// TODO: Make sure deployer got chocolate and weth back (greater amount than before)
	});
});
