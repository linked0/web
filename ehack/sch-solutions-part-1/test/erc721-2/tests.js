const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('ERC721 Tokens Exercise 2', function () {
    
    let deployer, user1, user2, user3;

    const CUTE_NFT_PRICE = ethers.utils.parseEther('5');
    const BOOBLES_NFT_PRICE = ethers.utils.parseEther('7');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2, user3] = await ethers.getSigners();

        // User1 creates his own NFT collection
        let NFTFactory = await ethers.getContractFactory(
            'contracts/utils/DummyERC721.sol:DummyERC721',
            user1
        );
        this.cuteNFT = await NFTFactory.deploy("Crypto Cuties", "CUTE", 1000);
        await this.cuteNFT.mintBulk(30);
        expect(await this.cuteNFT.balanceOf(user1.address)).to.be.equal(30);
        
        // User3 creates his own NFT collection
        NFTFactory = await ethers.getContractFactory('DummyERC721', user3);
        this.booblesNFT = await NFTFactory.deploy("Rare Boobles", "BOO", 10000);
        await this.booblesNFT.mintBulk(120);
        expect(await this.booblesNFT.balanceOf(user3.address)).to.be.equal(120);

        // Store users initial balance
        this.user1InitialBalance = await ethers.provider.getBalance(user1.address);
        this.user2InitialBalance = await ethers.provider.getBalance(user2.address);
        this.user3InitialBalance = await ethers.provider.getBalance(user3.address);
    });

    it('Deployment & Listing Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deploy Marketplace from deployer
        let MarketplaceFactory = await ethers.getContractFactory(
            'contracts/erc721-2/OpenOcean.sol:OpenOcean',
            deployer
        );
        this.marketplace = await MarketplaceFactory.deploy();
        
        // TODO: User1 lists Cute NFT tokens 1-10 for 5 ETH each
        for(let i = 1; i <= 10; i++) {
            await this.cuteNFT.approve(this.marketplace.address, i);
            await this.marketplace.connect(user1).listItem(
                this.cuteNFT.address,
                i,
                CUTE_NFT_PRICE
            )
        }

        // TODO: Check that Marketplace owns 10 Cute NFTs
        expect(await this.cuteNFT.balanceOf(this.marketplace.address)).to.be.equal(10);

        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 10th item.
        let lastItem = await this.marketplace.listedItems(10);
        expect(lastItem.itemId).to.be.equal(10);
        expect(lastItem.collection).to.be.equal(this.cuteNFT.address);
        expect(lastItem.tokenId).to.be.equal(10);
        expect(lastItem.price).to.be.equal(CUTE_NFT_PRICE);
        expect(lastItem.seller).to.be.equal(user1.address);
        expect(lastItem.isSold).to.be.equal(false);
        

        // TODO: User3 lists Boobles NFT tokens 1-5 for 7 ETH each
        for(let i = 1; i <= 5; i++) {
            await this.booblesNFT.approve(this.marketplace.address, i);
            await this.marketplace.connect(user3).listItem(
                this.booblesNFT.address,
                i,
                BOOBLES_NFT_PRICE
            )
        }

        // TODO: Check that Marketplace owns 5 Booble NFTs
        expect(await this.booblesNFT.balanceOf(this.marketplace.address)).to.be.equal(5);
        

        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 15th item.
        lastItem = await this.marketplace.listedItems(15);
        expect(lastItem.itemId).to.be.equal(15);
        expect(lastItem.collection).to.be.equal(this.booblesNFT.address);
        expect(lastItem.tokenId).to.be.equal(5);
        expect(lastItem.price).to.be.equal(BOOBLES_NFT_PRICE);
        expect(lastItem.seller).to.be.equal(user3.address);
        expect(lastItem.isSold).to.be.equal(false);
    });

    it('Purchases Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // All Purchases From User2 //
        
        // TODO: Try to purchase itemId 100, should revert
        await expect(this.marketplace.connect(user2).purchase(100)).to.be.revertedWith("incorrect _itemId")

        // TODO: Try to purchase itemId 3, without ETH, should revert
        await expect(this.marketplace.connect(user2).purchase(3)).to.be.revertedWith("wrong ETH was sent")

        // TODO: Try to purchase itemId 3, with ETH, should work
        await this.marketplace.connect(user2).purchase(3, {value: CUTE_NFT_PRICE})

        // TODO: Can't purchase sold item
        await expect(this.marketplace.connect(user2).purchase(3, {value: CUTE_NFT_PRICE})).to.be.revertedWith("item is already sold")

        // TODO: User2 owns itemId 3 -> Cuties tokenId 3
        expect(await this.cuteNFT.ownerOf(3)).to.be.equal(user2.address)

        // TODO: User1 got the right amount of ETH for the sale
        let user1Balance = await ethers.provider.getBalance(user1.address);
        expect(user1Balance).to.be.gt(this.user1InitialBalance.add(CUTE_NFT_PRICE).sub(ethers.utils.parseEther('0.2')))

        // TODO: Purchase itemId 11
        await this.marketplace.connect(user2).purchase(11, {value: BOOBLES_NFT_PRICE})
        
        // TODO: User2 owns itemId 11 -> Boobles tokenId 1
        expect(await this.booblesNFT.ownerOf(1)).to.be.equal(user2.address)
        
        // TODO: User3 got the right amount of ETH for the sale
        let user3Balance = await ethers.provider.getBalance(user3.address);
        expect(user3Balance).to.be.gt(this.user3InitialBalance.add(BOOBLES_NFT_PRICE).sub(ethers.utils.parseEther('0.2')))
    });
});
