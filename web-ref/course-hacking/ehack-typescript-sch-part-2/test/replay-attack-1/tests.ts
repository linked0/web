import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { MultiSignatureWallet } from '../../typechain-types';
import { concatV5 } from '../utils/concatV5';

const { provider, deployContract, getSigners, parseEther, solidityPacked, Signature } = ethers;

describe('Replay Attack Exercise 1', function () {
	let deployer: SignerWithAddress, signer2: SignerWithAddress, attacker: SignerWithAddress;

	const ETH_IN_MULTISIG = parseEther('100');
	const ATTACKER_WITHDRAW = parseEther('1');

	let multiSigWallet: MultiSignatureWallet;

	let attackerBalanceBeforeAttack: bigint;

	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

		[deployer, signer2, attacker] = await getSigners();

		// Deploy multi sig
		multiSigWallet = await deployContract('MultiSignatureWallet', [[deployer.address, signer2.address]]);

		// Send ETH to multisig Wallet
		await deployer.sendTransaction({
			to: multiSigWallet.target,
			value: ETH_IN_MULTISIG,
		});

		// Prepare withdraw Message
		const message = solidityPacked(['address', 'uint256'], [attacker.address, ATTACKER_WITHDRAW]);

		const messageBuffer = concatV5([message]);

		// Sign message
		let signatory1Signature = await deployer.signMessage(messageBuffer);
		let signatory2Signature = await signer2.signMessage(messageBuffer);

		// Split signatures (v,r,s)
		let signatory1SplitSig = Signature.from(signatory1Signature);
		let signatory2SplitSig = Signature.from(signatory2Signature);

		// Call transfer with signatures
		await multiSigWallet.transfer(attacker.address, ATTACKER_WITHDRAW, [signatory1SplitSig, signatory2SplitSig]);

		expect(await provider.getBalance(multiSigWallet.target)).equals(ETH_IN_MULTISIG - ATTACKER_WITHDRAW);

		attackerBalanceBeforeAttack = await provider.getBalance(attacker.address);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		expect(await provider.getBalance(multiSigWallet.target)).equals(0);

		let attackerBalanceAfterAttack = await provider.getBalance(attacker.address);

		// Attacker is supposed to own the stolen ETH ( +99 ETH , -0.1 ETH for gas)
		expect(attackerBalanceAfterAttack).is.gt(attackerBalanceBeforeAttack + ETH_IN_MULTISIG - ATTACKER_WITHDRAW - parseEther('0.1'));
	});
});
