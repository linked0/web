const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('TX Origin Phishing Exercise 1', function () {

    let fundManager, attacker;
    const HEDGE_FUND_DEPOSIT = ethers.utils.parseEther('2800'); // 2800 ETH
    const CHARITY_DONATION = ethers.utils.parseEther('0.1'); // 0.1 ETH

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [fundManager, attacker] = await ethers.getSigners();
        this.attackerContract = null;

        this.attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address);

        // Deploy smart wallet and deposit ETH (from "Binance")
        // const simpleSmartWalletFactory = await ethers.getContractFactory(
        //     'contracts/tx-origin-phishing-1/solution/SimpleSmartWalletSecured.sol:SimpleSmartWalletSecured',
        //     fundManager
        // );
        const simpleSmartWalletFactory = await ethers.getContractFactory(
            'contracts/tx-origin-phishing-1/SimpleSmartWallet.sol:SimpleSmartWallet',
            fundManager
        );
        this.wallet = await simpleSmartWalletFactory.deploy({value: HEDGE_FUND_DEPOSIT});

        let smartWalletBalance = await ethers.provider.getBalance(this.wallet.address);
        expect(smartWalletBalance).to.equal(HEDGE_FUND_DEPOSIT);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        const MaliciousCharityFactory = await ethers.getContractFactory(
            'contracts/tx-origin-phishing-1/solution/MaliciousCharity.sol:MaliciousCharity',
            attacker
        );
        this.attackerContract = await MaliciousCharityFactory.deploy(this.wallet.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Fund manager is tricked to send a donation to the "charity" (attacker's contract)
        await fundManager.sendTransaction({
            to: this.attackerContract.address,
            value: CHARITY_DONATION
        });

        // Smart wallet supposed to be emptied
        let walletBalance = await ethers.provider.getBalance(this.wallet.address);
        expect(walletBalance).to.equal(0);

        // Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.attackerInitialEthBalance.add(HEDGE_FUND_DEPOSIT).sub(ethers.utils.parseEther('0.2')));
    });
});
