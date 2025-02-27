const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Flash Loan Exercise 1', function () {

    let deployer, user;
    const POOL_BALANCE = ethers.utils.parseEther('1000');

    it('Flash Loan Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deploy Pool.sol contract with 1,000 ETH
        const PoolFactory = await ethers.getContractFactory(
            'contracts/flash-loans-1/Pool.sol:Pool',
            deployer
        );
        const pool = await PoolFactory.deploy({value: POOL_BALANCE});

        // TODO: Deploy Receiver.sol contract
        const ReceiverFactory = await ethers.getContractFactory(
            'contracts/flash-loans-1/Receiver.sol:Receiver',
            user
        );
        const receiver = await ReceiverFactory.deploy(pool.address);
        
        // TODO: Successfuly execute a Flash Loan of all the balance using Receiver.sol contract
        await receiver.flashLoan(POOL_BALANCE);

        // TODO: Deploy GreedyReceiver.sol contract
        const GreedyReceiverFactory = await ethers.getContractFactory(
            'contracts/flash-loans-1/GreedyReceiver.sol:GreedyReceiver',
            user
        );
        const greedyReceiver = await GreedyReceiverFactory.deploy(pool.address);
        
        // TODO: Fails to execute a flash loan with GreedyReceiver.sol contract
        await expect(greedyReceiver.flashLoan(POOL_BALANCE)).to.be.revertedWith("ETH wasn't paid back");
    });

});
