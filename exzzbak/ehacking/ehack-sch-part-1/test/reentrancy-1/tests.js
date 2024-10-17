const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Reentrancy Exercise 1', function () {

    let deployer, user1, user2, user3, user4, attacker;

    let USER1_DEPOSIT = ethers.utils.parseEther('12');
    let USER2_DEPOSIT = ethers.utils.parseEther('6');
    let USER3_DEPOSIT = ethers.utils.parseEther('28');
    let USER4_DEPOSIT = ethers.utils.parseEther('63');

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, user4, attacker] = await ethers.getSigners();

        const EtherBankFactory = await ethers.getContractFactory(
            'contracts/reentrancy-1/EtherBank.sol:EtherBank',
            deployer
        );
        // const EtherBankFactory = await ethers.getContractFactory(
        //     'contracts/reentrancy-1/solution/SecuredEtherBank.sol:SecuredEtherBank',
        //     deployer
        // );
        this.bank = await EtherBankFactory.deploy();
        
        await this.bank.connect(user1).depositETH({ value: USER1_DEPOSIT });
        await this.bank.connect(user2).depositETH({ value: USER2_DEPOSIT });
        await this.bank.connect(user3).depositETH({ value: USER3_DEPOSIT });
        await (await this.bank.connect(user4).depositETH({ value: USER4_DEPOSIT })).wait();

        this.attackerInitialEthBalance = await ethers.provider.getBalance(attacker.address);
        this.bankInitialBalance = await ethers.provider.getBalance(this.bank.address);

        expect(this.bankInitialBalance).to.equal(
            USER1_DEPOSIT.add(USER2_DEPOSIT).add(USER3_DEPOSIT).add(USER4_DEPOSIT)
        );
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const AttackBankFactory = await ethers.getContractFactory(
            'contracts/reentrancy-1/solution/AttackBank.sol:AttackBank',
            attacker
        );
        this.attackBank = await AttackBankFactory.deploy(this.bank.address);
        await this.attackBank.attack({value: ethers.utils.parseEther('1')});

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        let bankBalance = await ethers.provider.getBalance(this.bank.address);
        expect(bankBalance).to.be.equal(0);

        let attackerBalance = await ethers.provider.getBalance(attacker.address)
        expect(attackerBalance).to.be.gt(
            this.attackerInitialEthBalance.add(this.bankInitialBalance).sub(ethers.utils.parseEther('0.2'))
        );
    });
});
