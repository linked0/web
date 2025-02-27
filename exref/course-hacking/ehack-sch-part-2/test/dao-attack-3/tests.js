const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DAO Attack Exercise 3', function () {

    let deployer, member1, member2, attacker;

    // DAO Tokens
    const DEPLOYER_TOKENS = ethers.utils.parseEther('2500000'); // 2.5M Tokens
    const MEMBER_1_TOKENS = ethers.utils.parseEther('500000'); // 500K Tokens
    const MEMBER_2_TOKENS = ethers.utils.parseEther('1000000'); // 1M Tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('2000000'); // 2M tokens

    // Treasury ETH
    const ETH_IN_TREASURY = ethers.utils.parseEther('1500'); // 1500 ETH
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, member1, member2, attacker] = await ethers.getSigners();

        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);

        // Contract Factories
        const DAOTokenFactory = await ethers.getContractFactory(
            'contracts/dao-attack-3/DAOToken.sol:DAOToken',
            deployer
        );
        const GovernanceFactory = await ethers.getContractFactory(
            'contracts/dao-attack-3/Governance.sol:Governance',
            deployer
        );
        const LendingPoolFactory = await ethers.getContractFactory(
            'contracts/dao-attack-3/LendingPool.sol:LendingPool',
            deployer
        );
        const TreasuryFactory = await ethers.getContractFactory(
            'contracts/dao-attack-3/Treasury.sol:Treasury',
            deployer
        );

        // Deploy and Setup Contracts
        this.token = await DAOTokenFactory.deploy();
        this.pool = await LendingPoolFactory.deploy(this.token.address);
        this.treasury = await TreasuryFactory.deploy();
        this.governance = await GovernanceFactory.deploy(this.token.address, this.treasury.address);
        await this.treasury.setGovernance(this.governance.address);
        
        // Send ETH to Treasury
        await deployer.sendTransaction({
            to: this.treasury.address,
            value: ETH_IN_TREASURY
        });
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal(ETH_IN_TREASURY);
        
        // Mint tokens
        await this.token.mint(deployer.address, DEPLOYER_TOKENS);
        await this.token.mint(member1.address, MEMBER_1_TOKENS);
        await this.token.mint(member2.address, MEMBER_2_TOKENS);
        await this.token.mint(this.pool.address, TOKENS_IN_POOL);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const AttackDAOFactory = await ethers.getContractFactory(
            'contracts/dao-attack-3/solution/AttackDAO.sol:AttackDAO',
            attacker
        );
        
        this.attackDAO = await AttackDAOFactory.deploy(
            this.token.address, this.treasury.address, this.governance.address, this.pool.address
        );

        await this.attackDAO.attack();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // No ETH left in treasury
        expect(
            await ethers.provider.getBalance(this.treasury.address)
        ).to.be.equal('0');

        // Attacker has taken all ETH from treasury
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(((this.attackerInitialETHBalance).add(ETH_IN_TREASURY)).sub(ethers.utils.parseEther('0.2')));
    });
});
