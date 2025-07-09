const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Flash Loan Attacks Exercise 1', function () {
    
    let deployer, attacker;
    const POOL_TOKENS = ethers.utils.parseEther('100000000'); // 100M tokens

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
        
        [deployer, attacker] = await ethers.getSigners();

        // Deploy token & pool
        const Token = await ethers.getContractFactory(
            'contracts/flash-loan-attacks-1/Token.sol:Token',
            deployer
        );
        const Pool = await ethers.getContractFactory(
            'contracts/flash-loan-attacks-1/Pool.sol:Pool',
            deployer
        );
        this.token = await Token.deploy();
        this.pool = await Pool.deploy(this.token.address);

        // Transfer tokens to pool
        await this.token.transfer(this.pool.address, POOL_TOKENS);

        // Pool should have 100M, attacker should have 0 tokens
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(POOL_TOKENS);
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal('0');
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const AttackPool = await ethers.getContractFactory(
            'contracts/flash-loan-attacks-1/solution/AttackPool.sol:AttackPool',
            attacker
        );
        this.attackPool = await AttackPool.deploy(this.pool.address, this.token.address);
        await this.attackPool.attack();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker successfully stole all tokens form the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(POOL_TOKENS);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal('0');
    });
});

