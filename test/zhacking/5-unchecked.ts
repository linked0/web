import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { DonationMaster, MultiSigSafe, DonationMasterSecured, MultiSigSafeSecured } from '../../typechain-types';

const { deployContract, getSigners, parseEther } = ethers;

describe('Unchecked Returns Exercises', () => {
  describe('Exercise 1', () => {
    let deployer: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;

    const ONE_ETH = parseEther('1');
    const HUNDRED_ETH = parseEther('100');
    const THOUSAND_ETH = parseEther('1000');

    let donationMaster: DonationMaster;
    let multiSig: MultiSigSafe;
    let donationMaster2: DonationMasterSecured;
    let multiSig2: MultiSigSafeSecured;

    before(async () => {
      [deployer, user1, user2, user3] = await getSigners();

      // Deploy DonationMaster contract
      donationMaster = await deployContract('DonationMaster');

      multiSig = await deployContract('MultiSigSafe', [[user1.address, user2.address, user3.address], 2]);

      // Deploy DonationMaster contract
      donationMaster2 = await deployContract('DonationMasterSecured');

      multiSig2 = await deployContract('MultiSigSafeSecured', [[user1.address, user2.address, user3.address], 2]);
    });

    it('Donation tests', async function () {
      /* SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

      // New donation works
      await donationMaster.newDonation(multiSig.target, HUNDRED_ETH);
      let donationId = (await donationMaster.donationsNo()) - 1n;

      // Donating to multisig wallet works
      await donationMaster.donate(donationId, { value: ONE_ETH });

      // Validate donation details
      let donationInfo = await donationMaster.donations(donationId);
      expect(donationInfo.id).equals(donationId);
      expect(donationInfo.to).equals(multiSig.target);
      expect(donationInfo.goal).equals(HUNDRED_ETH);
      expect(donationInfo.donated).equals(ONE_ETH);

      // Too big donation fails (goal reached)
      await expect(donationMaster.donate(donationId, { value: THOUSAND_ETH })).to.be.reverted;

      expect(await ethers.provider.getBalance(multiSig.target)).to.be.not.equal(ONE_ETH);
    });

    it('Fixed test1', async () => {
      // New donation works
      await donationMaster2.newDonation(multiSig.target, HUNDRED_ETH);
      let donationId = (await donationMaster2.donationsNo()) - 1n;

      // Validate donation details
      let donationInfo = await donationMaster2.donations(donationId);
      expect(donationInfo.id).equals(donationId);
      expect(donationInfo.to).equals(multiSig.target);
      expect(donationInfo.goal).equals(HUNDRED_ETH);
      expect(donationInfo.donated).equals(0);

      // Donating reverted due to multiSig can't receive donations
      await expect(donationMaster2.donate(donationId, { value: ONE_ETH })).to.be.reverted;
    });

    it('Fixed test2', async () => {
      // New donation works
      await donationMaster2.newDonation(multiSig2.target, HUNDRED_ETH);
      let donationId = (await donationMaster2.donationsNo()) - 1n;

      // Donating to multisig wallet works
      await donationMaster2.donate(donationId, { value: ONE_ETH });

      // Validate donation details
      let donationInfo = await donationMaster2.donations(donationId);
      expect(donationInfo.id).equals(donationId);
      expect(donationInfo.to).equals(multiSig2.target);
      expect(donationInfo.goal).equals(HUNDRED_ETH);
      expect(donationInfo.donated).equals(ONE_ETH);

      // Too big donation fails (goal reached)
      await expect(donationMaster2.donate(donationId, { value: THOUSAND_ETH })).to.be.reverted;

      expect(await ethers.provider.getBalance(multiSig2.target)).to.be.equal(ONE_ETH);
    });
  });
});