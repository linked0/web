const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const slot = ethers.id('some.storage.slot');
const otherSlot = ethers.id('some.other.storage.slot');

// NOTE: This is from test/oz/utils/StorageSlot.test.js

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('StorageSlot', function () {
  it(`Boolean storage slot`, async function () {
    value = true;
    mock = await ethers.deployContract('StorageSlotMock')
    await mock.waitForDeployment()

    // Set value to slot
    await mock.setBooleanSlot(slot, value);

    // Get value from slot
    // NOTE: This should be checked why this returns false instead of true
    const ret = await mock.getBooleanSlot(slot)
    expect(ret).to.equal(value);
  });
});