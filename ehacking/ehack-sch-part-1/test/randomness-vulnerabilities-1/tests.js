const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Randomness Vulnerabilites Exercise 1', function () {

    let deployer, attacker;
    const GAME_POT = ethers.utils.parseEther('10'); // 10 ETH

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, attacker] = await ethers.getSigners();
        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);

        // Deploy wallet and deposit 10 ETH
        const gameFactory = await ethers.getContractFactory(
            'contracts/randomness-vulnerabilities-1/Game.sol:Game',
            deployer
        );
        this.game = await gameFactory.deploy({value: GAME_POT});

        let inGame = await ethers.provider.getBalance(this.game.address);
        expect(inGame).to.equal(GAME_POT);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const attackGameFactory = await ethers.getContractFactory(
            'contracts/randomness-vulnerabilities-1/solution/AttackGame.sol:AttackGame',
            attacker
        );
        this.attackerContract = await attackGameFactory.deploy(this.game.address);
        await this.attackerContract.attack();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Game funds were stolen
        expect(await ethers.provider.getBalance(this.game.address)).to.equal(0);

        // Attacker supposed to own the stolen ETH (-0.2 ETH for gas...)
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.attackerInitialBalance.add(GAME_POT).sub(ethers.utils.parseEther('0.2')));
    });
});
