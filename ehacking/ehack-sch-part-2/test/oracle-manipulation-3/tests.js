const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Oracle Manipulation Exercise 3', function () {

    let deployer, attacker;

    // Addresses
    const PAIR_ADDRESS = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11" // DAI/WETH
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const IMPERSONATED_ACCOUNT_ADDRESS = "0xf977814e90da44bfa03b6295a0616a897441acec" // Binance Hot Wallet

    // Amounts
    const WETH_LIQUIDITY = ethers.utils.parseEther('1000'); // 1000 ETH
    const DAI_LIQUIDITY = ethers.utils.parseEther('1500000'); // 1.5M USD

    // Attacker Added Constants 
    UNISWAPV2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    AAVE_POOL_ADDRESS = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
    AAVE_AWETH_ADDRESS = '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e';
    AAVE_ADAI_ADDRESS = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
        
        [deployer, attacker] = await ethers.getSigners();

         // Attacker starts with 1 ETH
         await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0xDE0B6B3A7640000", // 1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('1'));

        // Deploy LendLand with DAI/WETH contract
        const LendLandFactory = await ethers.getContractFactory(
            'contracts/oracle-manipulation-3/LendLand.sol:LendLand',
            deployer
        );
        this.lendland = await LendLandFactory.deploy(PAIR_ADDRESS);

        // Load Tokens contract
        this.weth = await ethers.getContractAt(
            "contracts/interfaces/IWETH9.sol:IWETH9",
            WETH_ADDRESS
        );
        this.dai = await ethers.getContractAt(
            "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
            DAI_ADDRESS
        );

        // Convert ETH to WETH
        await this.weth.deposit({value: WETH_LIQUIDITY})
        expect(await this.weth.balanceOf(deployer.address)).to.equal(WETH_LIQUIDITY)

        // Deposit WETH from Deployer to LendLand
        await this.weth.approve(this.lendland.address, WETH_LIQUIDITY)
        await this.lendland.deposit(this.weth.address, WETH_LIQUIDITY)
        // WETH despoit succeded
        expect(await this.weth.balanceOf(this.lendland.address)).to.equal(WETH_LIQUIDITY)
        expect(await this.lendland.deposited(this.weth.address, deployer.address)).to.equal(WETH_LIQUIDITY)

        // Depsit DAI on LendLand (from Binance hot wallet)
        let impersonatedSigner = await ethers.getImpersonatedSigner(IMPERSONATED_ACCOUNT_ADDRESS);
        await this.dai.connect(impersonatedSigner).approve(this.lendland.address, DAI_LIQUIDITY);
        await this.lendland.connect(impersonatedSigner).deposit(this.dai.address, DAI_LIQUIDITY)
        // DAI despoit succeded
        expect(await this.dai.balanceOf(this.lendland.address)).to.equal(DAI_LIQUIDITY)
        expect(await this.lendland.deposited(this.dai.address, impersonatedSigner.address)).to.equal(DAI_LIQUIDITY)
        
        // Didn't deposit WETH so can't borrow DAI
        expect(this.lendland.connect(impersonatedSigner).borrow(this.dai.address, DAI_LIQUIDITY)).to.be.reverted;

        // WETH depositor can borrow some DAI
        await this.lendland.borrow(this.dai.address, ethers.utils.parseEther('100'))
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        const AttackerFactory = await ethers.getContractFactory(
            'contracts/oracle-manipulation-3/solution/AttackLendLand.sol:AttackLendLand',
            attacker
        );
        const attackerContract = await AttackerFactory.deploy(
            PAIR_ADDRESS, UNISWAPV2_ROUTER_ADDRESS, this.lendland.address,
            AAVE_POOL_ADDRESS, AAVE_AWETH_ADDRESS, AAVE_ADAI_ADDRESS
        );
        await attackerContract.attack();
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Protocol Liquidity
        console.log("LendLand DAI balance: ", ethers.utils.formatUnits(await this.dai.balanceOf(this.lendland.address)));
        console.log("LendLand WETH balance: ", ethers.utils.formatUnits(await this.weth.balanceOf(this.lendland.address)));
        
        console.log("Attacker DAI balance: ", ethers.utils.formatUnits(await this.dai.balanceOf(attacker.address)));
        console.log("Attacker WETH balance: ", ethers.utils.formatUnits(await this.weth.balanceOf(attacker.address)));
        
        // Pool liquidity should be at least -98%
        expect(await this.dai.balanceOf(this.lendland.address)).to.be.lessThan(DAI_LIQUIDITY.mul(2).div(100))
        expect(await this.weth.balanceOf(this.lendland.address)).to.be.lessThan(WETH_LIQUIDITY.mul(2).div(100))

        // Attacker stole the liquidity - at least +92%
        expect(await this.dai.balanceOf(attacker.address)).to.be.greaterThan(DAI_LIQUIDITY.mul(92).div(100))
        expect(await this.weth.balanceOf(attacker.address)).to.be.greaterThan(WETH_LIQUIDITY.mul(92).div(100))
    });
});
