const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Unchecked Returns Exercise 1', function () {

    let deployer, user1, user2, user3;

    const ONE_ETH = ethers.utils.parseEther('1'); // 100 ETH
    const HUNDRED_ETH = ethers.utils.parseEther('100'); // 100 ETH
    const THOUSAND_ETH = ethers.utils.parseEther('1000'); // 100 ETH

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        // Deploy DonationMaster contract
        // const DonationMasterFactory = await ethers.getContractFactory(
        //     'contracts/unchecked-returns-1/DonationMaster.sol:DonationMaster',
        //     deployer
        // );
        const DonationMasterFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-1/solution/DonationMasterSecured.sol:DonationMasterSecured',
            deployer
        );
        this.donationMaster = await DonationMasterFactory.deploy();

        // Deploy MultiSigSafe contract (2 signatures out of 3)
        // const MultiSigSafeFactory = await ethers.getContractFactory(
        //     'contracts/unchecked-returns-1/MultiSigSafe.sol:MultiSigSafe',
        //     deployer
        // );
        const MultiSigSafeFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-1/solution/MultiSigSafeSecured.sol:MultiSigSafeSecured',
            deployer
        );
        this.multiSig = await MultiSigSafeFactory.deploy(
            [user1.address, user2.address, user3.address], 2
        );
        
    });

    it('Donation tests', async function () {
        /* SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
        
        // New donation works
        await this.donationMaster.newDonation(this.multiSig.address, HUNDRED_ETH);
        let donationId = await this.donationMaster.donationsNo() - 1;

        // Donating to multisig wallet works
        await this.donationMaster.donate(donationId, {value: ONE_ETH});

        // Validate donation details
        let donationInfo = await this.donationMaster.donations(donationId);
        expect(donationInfo.id).to.equal(donationId);
        expect(donationInfo.to).to.equal(this.multiSig.address);
        expect(donationInfo.goal).to.equal(HUNDRED_ETH);
        expect(donationInfo.donated).to.equal(ONE_ETH);

        // Too big donation fails (goal reached)
        expect(this.donationMaster.donate(donationId, {value: THOUSAND_ETH})).to.be.reverted;
    });

    it('Fixed tests', async function () {
        /* CODE YOUR SOLUTION HERE */
        /* Write the correct tests here */
        
        expect(await ethers.provider.getBalance(this.multiSig.address)).to.be.equal(ONE_ETH);

    });
});
