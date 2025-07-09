import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { RestrictedOwner, UnrestrictedOwner } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('Calls Attacks Exercise 1', function () {
	let deployer: SignerWithAddress, user: SignerWithAddress, attacker: SignerWithAddress;

	let unrestrictedOwner: UnrestrictedOwner;
	let restrictedOwner: RestrictedOwner;
	before(async function () {
		/** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
		[deployer, user, attacker] = await getSigners();

		// Deploy
		unrestrictedOwner = await deployContract('UnrestrictedOwner');
		restrictedOwner = await deployContract('RestrictedOwner', [unrestrictedOwner.target]);

		// Any user can take ownership on `UnrestrictedOwner` contract
		await expect(unrestrictedOwner.connect(user).changeOwner(user.address)).not.to.be.reverted;
		expect(await unrestrictedOwner.owner()).to.equal(user.address);

		// Any user can't take ownership on `RestrictedOwner` contract
		await expect(restrictedOwner.connect(user).updateSettings(user.address, user.address)).to.be.reverted;
		expect(await restrictedOwner.owner()).to.equal(deployer.address);
		expect(await restrictedOwner.manager()).to.equal(deployer.address);
	});

	it('Exploit', async function () {
		/** CODE YOUR SOLUTION HERE */
	});

	after(async function () {
		/** SUCCESS CONDITIONS */

		// Attacker should take ownership on `RestrictedOwner` contract
		expect(await restrictedOwner.owner()).to.equal(attacker.address);
		expect(await restrictedOwner.manager()).to.equal(attacker.address);
	});
});
