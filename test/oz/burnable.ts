const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const name = 'My Token';
const symbol = 'MTKN';
const initialBalance = 1000n;

async function fixture() {
  const [owner, burner] = await ethers.getSigners();

  const token = await ethers.deployContract('$ERC20Burnable', [name, symbol], owner);
  await token.$_mint(owner, initialBalance);

  return { owner, burner, token, initialBalance };
}

describe('ERC20Burnable', function () {
  beforeEach(async function () {
    Object.assign(this, await loadFixture(fixture));
  });

  describe('burn', function () {
    console.log('Hello, Burnable!');
    it('reverts if not enough balance', async function () {
      const value = this.initialBalance + 1n;

      await expect(this.token.connect(this.owner).burn(value))
        .to.be.revertedWithCustomError(this.token, 'ERC20InsufficientBalance')
        .withArgs(this.owner, this.initialBalance, value);
    });
  });
});