import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ERC20, IWETH9, LendLand } from '../../typechain-types';
// import { Lendland}
const { provider, deployContract, getSigners, parseEther, formatUnits } = ethers;

describe('Oracle Manipulation Exercise 3', function () {
	let deployer: SignerWithAddress, attacker: SignerWithAddress;
	let lendland: LendLand;
	let weth: IWETH9, dai: ERC20;

	// Addresses
	const PAIR_ADDRESS = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'; // DAI/WETH
	const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
	const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
	const IMPERSONATED_ACCOUNT_ADDRESS = '0xf977814e90da44bfa03b6295a0616a897441acec'; // Binance Hot Wallet

	// Amounts
	const WETH_LIQUIDITY = parseEther('1000'); // 1000 ETH
	const DAI_LIQUIDITY = parseEther('1500000'); // 1.5M USD

	// Attacker Added Constants
	const UNISWAPV2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
	const AAVE_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
	const AAVE_AWETH_ADDRESS = '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e';
	const AAVE_ADAI_ADDRESS = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await ethers.getSigners();

		// Attacker starts with 1 ETH
		await ethers.provider.send('hardhat_setBalance', [
			attacker.address,
			'0xDE0B6B3A7640000', // 1 ETH
		]);
		expect(await ethers.provider.getBalance(attacker.address)).to.equal(parseEther('1'));

		// Deploy LendLand with DAI/WETH contract
		lendland = await deployContract('LendLand', [PAIR_ADDRESS]);

		// Load Tokens contract
		weth = (await ethers.getContractAt('contracts/interfaces/IWETH9.sol:IWETH9', WETH_ADDRESS)) as unknown as IWETH9;
		dai = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', DAI_ADDRESS)) as unknown as ERC20;

		// Convert ETH to WETH
		await weth.deposit({ value: WETH_LIQUIDITY });
		expect(await weth.balanceOf(deployer.address)).to.equal(WETH_LIQUIDITY);

		// Deposit WETH from Deployer to LendLand
		await weth.approve(lendland.target, WETH_LIQUIDITY);
		await lendland.deposit(weth.target, WETH_LIQUIDITY);
		// WETH despoit succeded
		expect(await weth.balanceOf(lendland.target)).to.equal(WETH_LIQUIDITY);
		expect(await lendland.deposited(weth.target, deployer.address)).equals(WETH_LIQUIDITY);

		// Depsit DAI on LendLand (from Binance hot wallet)
		let impersonatedSigner = await ethers.getImpersonatedSigner(IMPERSONATED_ACCOUNT_ADDRESS);
		await dai.connect(impersonatedSigner).approve(lendland.target, DAI_LIQUIDITY);
		await lendland.connect(impersonatedSigner).deposit(dai.target, DAI_LIQUIDITY);
		// DAI despoit succeded
		expect(await dai.balanceOf(lendland.target)).to.equal(DAI_LIQUIDITY);
		expect(await lendland.deposited(dai.target, impersonatedSigner.address)).equals(DAI_LIQUIDITY);

		// Didn't deposit WETH so can't borrow DAI
		expect(lendland.connect(impersonatedSigner).borrow(dai.target, DAI_LIQUIDITY)).to.be.reverted;

		// WETH depositor can borrow some DAI
		await lendland.borrow(dai.target, parseEther('100'));
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Protocol Liquidity
		console.log('LendLand DAI balance: ', formatUnits(await dai.balanceOf(lendland.target)));
		console.log('LendLand WETH balance: ', formatUnits(await weth.balanceOf(lendland.target)));

		console.log('Attacker DAI balance: ', formatUnits(await dai.balanceOf(attacker.address)));
		console.log('Attacker WETH balance: ', formatUnits(await weth.balanceOf(attacker.address)));

		// Pool liquidity should be at least -98%
		expect(await dai.balanceOf(lendland.target)).to.be.lessThan((DAI_LIQUIDITY * 2n) / 100n);
		expect(await weth.balanceOf(lendland.target)).to.be.lessThan((WETH_LIQUIDITY * 2n) / 100n);

		// Attacker stole the liquidity - at least +92%
		expect(await dai.balanceOf(attacker.address)).to.be.greaterThan((DAI_LIQUIDITY * 92n) / 100n);
		expect(await weth.balanceOf(attacker.address)).to.be.greaterThan((WETH_LIQUIDITY * 92n) / 100n);
	});
});
