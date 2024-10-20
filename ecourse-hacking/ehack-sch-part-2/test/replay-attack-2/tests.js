const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Replay Attack Exercise 2', function () {

    let deployer, user1, user2, attacker;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners();

        // Attacker starts with 1 ETH in balance
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xde0b6b3a7640000", // 1 ETH
        ]);

        // Deploy RealtySale
        const RealtySaleFactory = await ethers.getContractFactory(
            "contracts/replay-attack-2/RealtySale.sol:RealtySale",
            deployer
        );
        this.realtySale = await RealtySaleFactory.deploy();

        // Attach to deployed RealtyToken
        const ShareTokenFactory = await ethers.getContractFactory(
            "contracts/replay-attack-2/RealtyToken.sol:RealtyToken"
        )
        const shareTokenAddress = await this.realtySale.getTokenContract()
        this.realtyToken = await ShareTokenFactory.attach(shareTokenAddress)

        // Buy without sending ETH reverts
        expect(this.realtySale.connect(user1).buy()).to.be.reverted;
        
        // Some users buy tokens (1 ETH each share)
        await this.realtySale.connect(user1).buy({value: ethers.utils.parseEther('1')})
        await this.realtySale.connect(user2).buy({value: ethers.utils.parseEther('1')})

        // 2 ETH in contract
        expect(await ethers.provider.getBalance(this.realtySale.address)).to.equal(
            ethers.utils.parseEther('2'))

        // Buyer got their share token
        expect(await this.realtyToken.balanceOf(user1.address)).to.equal(1);
        expect(await this.realtyToken.balanceOf(user2.address)).to.equal(1);
        
        // Solution: Secure the contract by setting the oracle, so it won't be address(0)
        // await this.realtySale.setOracle(deployer.address);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        const AttackRealtySaleFactory = await ethers.getContractFactory(
            "contracts/replay-attack-2/solution/AttackRealtySale.sol:AttackRealtySale",
            attacker
        );
        let attackerContract = await AttackRealtySaleFactory.deploy(this.realtySale.address);

        await attackerContract.attack()
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker bought all 98 shares
        expect(await this.realtyToken.balanceOf(attacker.address)).to.equal(98);

        // No more shares left :(
        let maxSupply = await this.realtyToken.maxSupply();
        expect(await this.realtyToken.lastTokenID()).to.equal(maxSupply)
    });
});