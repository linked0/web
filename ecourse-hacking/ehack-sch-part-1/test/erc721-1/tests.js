const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC721 Tokens Exercise 1', function () {
    
    let deployer, user1, user2;

    // Constants 
    const DEPLOYER_MINT = 5;
    const USER1_MINT = 3;
    const MINT_PRICE = ethers.utils.parseEther('0.1');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2] = await ethers.getSigners();

        /** CODE YOUR SOLUTION HERE */
        // TODO: Contract deployment
        const MyAwesomeArtFactory = await ethers.getContractFactory(
            'contracts/erc721-1/MyAwesomeArt.sol:MyAwesomeArt',
            deployer
        );
        this.nft = await MyAwesomeArtFactory.deploy();

    });

    it('Minting Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deployer mints
        // Deployer should own token ids 1-5
        for (let i=0; i<DEPLOYER_MINT; i++) {
            await this.nft.mint({value: MINT_PRICE});
        }
        
        // TODO: User 1 mints
        // User1 should own token ids 6-8
        for (let i=0; i<USER1_MINT; i++) {
            await this.nft.connect(user1).mint({value: MINT_PRICE});
        }
        
        // TODO: Check Minting
        expect(await this.nft.balanceOf(deployer.address)).to.be.equal(DEPLOYER_MINT)
        expect(await this.nft.balanceOf(user1.address)).to.be.equal(USER1_MINT)
    });

    it('Transfers Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Transferring tokenId 6 from user1 to user2
        await this.nft.connect(user1).transferFrom(user1.address, user2.address, 6)
        // TODO: Checking that user2 owns tokenId 6
        expect(await this.nft.ownerOf(6)).to.be.equal(user2.address)

        // TODO: Deployer approves User1 to spend tokenId 3
        await this.nft.approve(user1.address, 3);
        // TODO: Test that User1 has approval to spend TokenId3
        expect(await this.nft.getApproved(3)).to.be.equal(user1.address)
        
        // TODO: Use approval and transfer tokenId 3 from deployer to User1
        await this.nft.connect(user1).transferFrom(deployer.address, user1.address, 3)
        // TODO: Checking that user1 owns tokenId 3
        expect(await this.nft.ownerOf(3)).to.be.equal(user1.address)

        // TODO: Checking balances after transfer
        // Deployer: 5 minted, 1 sent, 0 received
        expect(await this.nft.balanceOf(deployer.address)).to.be.equal(4)
        
        // User1: 3 minted, 1 sent, 1 received
        expect(await this.nft.balanceOf(user1.address)).to.be.equal(3)
        
        // User2: 0 minted, 0 sent, 1 received
        expect(await this.nft.balanceOf(user2.address)).to.be.equal(1)
    });
});
