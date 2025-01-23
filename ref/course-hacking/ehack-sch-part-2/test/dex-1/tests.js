const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('DEFI Money Markets: DEX Exercise 1 - Chocolate Factory', function () {

    let deployer, user;

    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const RICH_SIGNER = "0x8eb8a3b98659cce290402893d0123abb75e3ab28"
    const ETH_BALANCE = ethers.utils.parseEther('300'); 

    const INITIAL_MINT = ethers.utils.parseEther('1000000'); 
    const INITIAL_LIQUIDITY = ethers.utils.parseEther('100000'); 
    const ETH_IN_LIQUIDITY = ethers.utils.parseEther('100');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user] = await ethers.getSigners();

        // Send ETH from rich signer to our deployer
        this.richSigner = await ethers.getImpersonatedSigner(RICH_SIGNER);
        await this.richSigner.sendTransaction({
            to: deployer.address,
            value: ETH_BALANCE,
        });

        this.weth = await ethers.getContractAt(
            "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
            WETH_ADDRESS
        );
    });

    it('Deployment', async function () {
        
        // TODO: Deploy your smart contract to `this.chocolate`, mint 1,000,000 tokens to deployer
        const ChocolateFactory = await ethers.getContractFactory(
            'contracts/dex-1/Chocolate.sol:Chocolate',
            deployer
        );
        this.chocolate = await ChocolateFactory.deploy(INITIAL_MINT);

        // TODO: Print newly created pair address and store pair contract to `this.pair`
        let pairAddress = await this.chocolate.uniswapV2Pair();
        console.log("Pair address: ", pairAddress);
        this.pair = await ethers.getContractAt(
            "contracts/interfaces/IUniswapV2.sol:IUniswapV2Pair",
            pairAddress
        );
    });

    it('Deployer add liquidity tests', async function () {

        // TODO: Add liquidity of 100,000 tokens and 100 ETH (1 token = 0.001 ETH)
        await this.chocolate.approve(this.chocolate.address, INITIAL_LIQUIDITY);
        await this.chocolate.addChocolateLiquidity(INITIAL_LIQUIDITY, {value: ETH_IN_LIQUIDITY});

        // TODO: Print the amount of LP tokens that the deployer owns
        console.log("LP Tokens deploer balance: ", await this.pair.balanceOf(deployer.address));
    });

    it('User swap tests', async function () {

        let userChocolateBalance = await this.chocolate.balanceOf(user.address);
        let userWETHBalance = await this.weth.balanceOf(user.address);
        
        // TODO: From user: Swap 10 ETH to Chocolate
        const TEN_ETH = ethers.utils.parseEther('10');
        await this.chocolate.connect(user).swapChocolates(this.weth.address, TEN_ETH, {value: TEN_ETH});

        // TODO: Make sure user received the chocolates (greater amount than before)
        expect(await this.chocolate.balanceOf(user.address)).to.be.greaterThan(userChocolateBalance);

        // TODO: From user: Swap 100 Chocolates to ETH
        const HUNDRED_CHOCOLATES = ethers.utils.parseEther('100');
        await this.chocolate.connect(user).approve(this.chocolate.address, HUNDRED_CHOCOLATES);
        await this.chocolate.connect(user).swapChocolates(this.chocolate.address, HUNDRED_CHOCOLATES);
        
        // TODO: Make sure user received the weth (greater amount than before)
        expect(await this.weth.balanceOf(user.address)).to.be.greaterThan(userWETHBalance);
    });

    it('Deployer remove liquidity tests', async function () {

        let deployerChocolateBalance = await this.chocolate.balanceOf(deployer.address);
        let deployerWETHBalance = await this.weth.balanceOf(deployer.address);
        
        // TODO: Remove 50% of deployer's liquidity
        let lpTokensBalance = await this.pair.balanceOf(deployer.address);
        await this.pair.approve(this.chocolate.address, lpTokensBalance.div(2));
        await this.chocolate.removeChocolateLiquidity(lpTokensBalance.div(2));
        
        // TODO: Make sure deployer owns 50% of the LP tokens (leftovers)
        expect(await this.pair.balanceOf(deployer.address)).to.be.equal(lpTokensBalance.div(2));
        
        // TODO: Make sure deployer got chocolate and weth back (greater amount than before)
        expect(await this.chocolate.balanceOf(deployer.address)).to.be.greaterThan(deployerChocolateBalance);
        expect(await this.weth.balanceOf(deployer.address)).to.be.greaterThan(deployerWETHBalance);
    });
});
