const { ethers } = require('hardhat');
const { expect } = require('chai');
const fs = require('fs');

describe('DEFI Money Markets: DEX Exercise 2 - Sniper', function () {

    let liquidityAdder, user;

    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    const UNISWAPV2_FACTORY_ADDRESS = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
    const UNISWAPV2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    const UNISWAPV2_ROUTER_ABI = fs.readFileSync("./test/dex-2/router.json").toString()

    const INITIAL_MINT = ethers.utils.parseEther('80000'); 
    const INITIAL_LIQUIDITY = ethers.utils.parseEther('10000'); 
    const ETH_IN_LIQUIDITY = ethers.utils.parseEther('50');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [liquidityAdder, user] = await ethers.getSigners();

        // Set ETH balance
        await ethers.provider.send("hardhat_setBalance", [
            liquidityAdder.address,
            "0x1043561A8829300000", // 300 ETH
        ]);
        await ethers.provider.send("hardhat_setBalance", [
            user.address,
            "0x1043561A8829300000", // 300 ETH
        ]);

        this.weth = await ethers.getContractAt(
            "contracts/interfaces/IWETH9.sol:IWETH9",
            WETH_ADDRESS
        );
        
        // Deploy token
        const dummyTokenFactory = await ethers.getContractFactory(
            'contracts/utils/DummyERC20.sol:DummyERC20',
            liquidityAdder
        );
        this.preciousToken = await dummyTokenFactory.deploy("PreciousToken", "PRECIOUS", INITIAL_MINT);
        
        // Load Uniswap Router contract
        this.uniswapRouter = new ethers.Contract(
            UNISWAPV2_ROUTER_ADDRESS, UNISWAPV2_ROUTER_ABI, liquidityAdder
        )

        // Set the liquidity add operation deadline
        const deadline = ((await ethers.provider.getBlock(
            await ethers.provider.getBlockNumber()
        )).timestamp) + 10000;
        
        // Deposit to WETH & approve router to spend tokens
        await this.weth.deposit({value: ETH_IN_LIQUIDITY})
        await this.weth.approve(UNISWAPV2_ROUTER_ADDRESS, ETH_IN_LIQUIDITY)
        await this.preciousToken.approve(UNISWAPV2_ROUTER_ADDRESS, INITIAL_LIQUIDITY)

        // Add the liquidity 10,000 PRECIOUS & 50 WETH
        await this.uniswapRouter.addLiquidity(
            this.preciousToken.address,
            WETH_ADDRESS,
            INITIAL_LIQUIDITY,
            ETH_IN_LIQUIDITY,
            INITIAL_LIQUIDITY,
            ETH_IN_LIQUIDITY,
            liquidityAdder.address,
            deadline
        )
    });

    it('Sniper Tests', async function () {
        
        // TODO: Deploy your smart contract to `this.sniper`
        const SniperFactory = await ethers.getContractFactory(
            'contracts/dex-2/Sniper.sol:Sniper',
            user
        );
        this.sniper = await SniperFactory.deploy(UNISWAPV2_FACTORY_ADDRESS);

        // TODO: Sniper the tokens using your snipe function
        // NOTE: Your rich friend is willing to invest 35 ETH in the project, and is willing to pay 0.02 WETH per PRECIOUS
        // Which is 4x time more expensive than the initial liquidity price. 
        // You should retry 3 times to buy the token.
        // Make sure to deposit to WETH and send the tokens to the sniper contract in advance
        const ethToInvest = ethers.utils.parseEther('35');
        const minAbsoluteAmountOut = ethers.utils.parseEther('1750');

        await this.weth.connect(user).deposit({value: ethToInvest});
        await this.weth.connect(user).transfer(this.sniper.address, ethToInvest)

        await this.sniper.snipe(
            this.weth.address, this.preciousToken.address, ethToInvest, minAbsoluteAmountOut, 3
        );
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Bot was able to snipe at least 4,000 precious tokens
        // Bought at a price of ~0.00875 ETH per token (35 / 4000)
        const preciousBalance = await this.preciousToken.balanceOf(user.address);
        console.log("Sniped tokens: ", preciousBalance)
        expect(preciousBalance).to.be.gt(ethers.utils.parseEther('4000'));
    });
});
