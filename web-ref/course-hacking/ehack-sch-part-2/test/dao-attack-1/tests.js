const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DAO Attack Exercise 1', function () {

    let deployer, user1, user2, user3;

    const DEPLOYER_MINT = ethers.utils.parseEther('1000');
    const USERS_MINT = ethers.utils.parseEther('100');
    const USER2_BURN = ethers.utils.parseEther('30');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3] = await ethers.getSigners();

        // Deploy contract
        const RainbowAllianceTokenFactory = await ethers.getContractFactory(
            'contracts/dao-attack-1/RainbowAllianceToken.sol:RainbowAllianceToken',
            deployer
        );
        this.rainbowAlliance = await RainbowAllianceTokenFactory.deploy();

        // Mint for deployer tokens
        await this.rainbowAlliance.mint(deployer.address, DEPLOYER_MINT)
        
        // Mint tokens to user1 and user2
        await this.rainbowAlliance.mint(user1.address, USERS_MINT)
        await this.rainbowAlliance.mint(user2.address, USERS_MINT)

        // Burn tokens from user2
        await this.rainbowAlliance.burn(user2.address, USER2_BURN)        
    });

    it('Test governance', async function () {
        /** TESTS - DON'T CHANGE ANYTHING HERE */
        
        // Can't create proposals, if there is no voting power
        await expect(this.rainbowAlliance.connect(user3).createProposal("Donate 1000$ to charities")).
        to.be.revertedWith("no voting rights");

        // Should be able to create proposals if you have voting power
        await expect(await this.rainbowAlliance.createProposal("Pay 100$ to george for a new Logo")).
        to.not.be.reverted;

        // Can't vote twice
        await expect(this.rainbowAlliance.vote(1, true)).to.be.revertedWith("already voted");
        
        // Shouldn't be able to vote without voting rights
        await expect(this.rainbowAlliance.connect(user3).vote(1, true)).to.be.revertedWith("no voting rights");

        // Non existing proposal, reverts
        await expect(this.rainbowAlliance.vote(123, false)).to.be.revertedWith("proposal doesn't exist");

        // Users votes
        await this.rainbowAlliance.connect(user1).vote(1, true)
        await this.rainbowAlliance.connect(user2).vote(1, false)

        // Check accounting is correct
        let proposal = await this.rainbowAlliance.getProposal(1);
        console.log(proposal);
        // Supposed to be 1,100 (User1 - 100, deployer - 1,000)
        expect(proposal.yes).to.equal(DEPLOYER_MINT.add(USERS_MINT));
        // Supposed to be 70 (100 - 30, becuase we burned 30 tokens of user2)
        expect(proposal.no).to.equal(USERS_MINT.sub(USER2_BURN));
    });
    
    it('PoC (Test which catches the bug)', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Complete the test that catches the bug
        // Transfer all tokens from User1 to User3
        // User1 shouldn't have voting power
        // User1 can't propose new proposal
        // User3 should have voting power
        // User3 can propose new proposal

        let user1Balance = await this.rainbowAlliance.balanceOf(user1.address);
        await this.rainbowAlliance.connect(user1).transfer(user3.address, user1Balance)
        await expect(this.rainbowAlliance.connect(user1).createProposal("DUMMY PROPOSAL"))
        .to.be.revertedWith("no voting rights");

    });
});
