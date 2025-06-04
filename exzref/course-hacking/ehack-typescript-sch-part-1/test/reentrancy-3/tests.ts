import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ChainLend, IERC20 } from '../../typechain-types';

const { provider, deployContract, getSigners, parseUnits, parseEther } = ethers;

describe('Reentrancy Exercise 3', function () {
	const imBTC_ADDRESS = '0x3212b29E33587A00FB1C83346f5dBFA69A458923';
	const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
	const imBTC_WHALE = '0xFEa4224Da399F672eB21a9F3F7324cEF1d7a965C';
	const USDC_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

	const USDC_IN_CHAINLEND = parseUnits('1000000', 6);

	let deployer: SignerWithAddress, attacker: SignerWithAddress;

	let chainLend: ChainLend;
	let imBTC: IERC20;
	let usdc: IERC20;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, attacker] = await getSigners();

		// Fund deployer & attacker with 100 ETH
		await provider.send('hardhat_setBalance', [
			attacker.address,
			'0x56BC75E2D63100000', // 100 ETH (ETH -> WEI -> Hexdecimal)
		]);
		await provider.send('hardhat_setBalance', [
			deployer.address,
			'0x56BC75E2D63100000', // 100 ETH (ETH -> WEI -> Hexdecimal)
		]);
		// Send some ETH for whales for tx fees
		await deployer.sendTransaction({
			to: USDC_WHALE,
			value: parseEther('2'),
		});
		await deployer.sendTransaction({
			to: imBTC_WHALE,
			value: parseEther('2'),
		});

		// ChainLend deployment
		chainLend = await ethers.deployContract('ChainLend', [imBTC_ADDRESS, USDC_ADDRESS]);

		// Load deployed imBTC contract & Impersonate a whale
		imBTC = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', imBTC_ADDRESS, deployer)) as unknown as IERC20;

		// Impersonate imBTC Whale and send 1 imBTC to attacker
		const imBTCWhale = await ethers.getImpersonatedSigner(imBTC_WHALE);
		await imBTC.connect(imBTCWhale).transfer(attacker.address, parseUnits('1', 8));

		// Impersonate USDC Whale and send 1M USDC to ChainLend
		const USDCWhale = await ethers.getImpersonatedSigner(USDC_WHALE);
		usdc = (await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADDRESS, deployer)) as unknown as IERC20;
		await usdc.connect(USDCWhale).transfer(chainLend.target, USDC_IN_CHAINLEND);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker drained all chainlend USDC balance
		expect(await usdc.balanceOf(attacker.address)).equals(USDC_IN_CHAINLEND);
	});
});
