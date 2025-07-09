const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Flash Loan Attacks Exercise 2', function () {
    
    let deployer, attacker;

    const ETH_IN_VAULT = ethers.utils.parseEther('1000'); // 1000 ETH

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
        
        [deployer, attacker] = await ethers.getSigners();

        const AdvancedVaultFactory = await ethers.getContractFactory(
            'contracts/flash-loan-attacks-2/AdvancedVault.sol:AdvancedVault',
            deployer
        );
        this.vault = await AdvancedVaultFactory.deploy();
        
        await this.vault.depositETH({ value: ETH_IN_VAULT });

        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);

        expect(
            await ethers.provider.getBalance(this.vault.address)
        ).to.equal(ETH_IN_VAULT);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        const AttackVaultFactory = await ethers.getContractFactory(
            'contracts/flash-loan-attacks-2/solution/AttackVault.sol:AttackVault',
            attacker
        );
        this.attackVault = await AttackVaultFactory.deploy(this.vault.address);
        await this.attackVault.attack();
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        expect(
            await ethers.provider.getBalance(this.vault.address)
        ).to.be.equal('0');
        
        // -0.2ETH for tx fees
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.attackerInitialBalance.add(ETH_IN_VAULT).sub(ethers.utils.parseEther('0.2')));
    });
});
