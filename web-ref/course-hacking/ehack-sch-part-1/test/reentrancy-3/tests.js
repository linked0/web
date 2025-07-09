const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Exercise 3", function () {

  const imBTC_ADDRESS = "0x3212b29E33587A00FB1C83346f5dBFA69A458923";
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  const imBTC_WHALE = "0xFEa4224Da399F672eB21a9F3F7324cEF1d7a965C"
  const USDC_WHALE = "0xF977814e90dA44bFA03b6295A0616a897441aceC"

  const USDC_IN_CHAINLEND = ethers.utils.parseUnits("1000000", 6);

  let deployer, attacker;

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [deployer, attacker] = await ethers.getSigners();

    // Fund deployer & attacker with 100 ETH
    await ethers.provider.send("hardhat_setBalance", [
      attacker.address,
      "0x56BC75E2D63100000", // 100 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      deployer.address,
      "0x56BC75E2D63100000", // 100 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    // Send some ETH for whales for tx fees
    await deployer.sendTransaction({
        to: USDC_WHALE,
        value: ethers.utils.parseUnits("2")
    });
    await deployer.sendTransaction({
        to: imBTC_WHALE,
        value: ethers.utils.parseUnits("2")
    });

    // ChainLend deployment
    const ChainLend = await ethers.getContractFactory(
      "contracts/reentrancy-3/ChainLend.sol:ChainLend", deployer
    );
    this.chainLend = await ChainLend.deploy(imBTC_ADDRESS, USDC_ADDRESS);

    // Load deployed imBTC contract & Impersonate a whale
    this.imBTC = await hre.ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      imBTC_ADDRESS,
      deployer
    );

    // Impersonate imBTC Whale and send 1 imBTC to attacker
    const imBTCWhale = await ethers.getImpersonatedSigner(imBTC_WHALE);
    await this.imBTC.connect(imBTCWhale).transfer(attacker.address, ethers.utils.parseUnits("1", 8));
    
    // Impersonate USDC Whale and send 1M USDC to ChainLend
    const USDCWhale = await ethers.getImpersonatedSigner(USDC_WHALE);
    this.usdc = await hre.ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      USDC_ADDRESS,
      deployer
    );
    await this.usdc.connect(USDCWhale).transfer(
      this.chainLend.address, USDC_IN_CHAINLEND
    );
    
  })

  it("Exploit", async () => {
    /** CODE YOUR SOLUTION HERE */
    
    const AttackChainLendFactory = await ethers.getContractFactory(
      "contracts/reentrancy-3/solution/AttackChainLend.sol:AttackChainLend", attacker
    );
    this.attackChainlend = await AttackChainLendFactory.deploy(imBTC_ADDRESS, USDC_ADDRESS, this.chainLend.address);

    await this.imBTC.connect(attacker).transfer(this.attackChainlend.address, ethers.utils.parseUnits("1", 8));
    await this.attackChainlend.attack()
  })

  after(async () => {
    /** SUCCESS CONDITIONS */

    // Attacker drained all chainlend USDC balance
    expect(await this.usdc.balanceOf(attacker.address)).to.be.equal(USDC_IN_CHAINLEND);
  })
  
});

