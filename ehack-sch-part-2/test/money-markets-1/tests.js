const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEFI Crash Course: Money Markets Exercise 1 - Aave V3", function () {
  /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */
  
  let user;

  const AAVE_POOL = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";

  // AAVE USDC Receipt Token
  const A_USDC = "0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c";
  // AAVE DAI Variable Debt Token
  const VARIABLE_DEBT_DAI = "0xcF8d0c70c850859266f5C338b38F9D663181C314";

  const USER_USDC_BALANCE = ethers.utils.parseUnits("100000", 6)
  const AMOUNT_TO_DEPOSIT = ethers.utils.parseUnits("1000", 6);
  const AMOUNT_TO_BORROW = ethers.utils.parseUnits("100", 18);

  before( async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [user] = await ethers.getSigners();

    // Load tokens
    this.usdc = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      USDC,
      user
    );
    this.dai = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      DAI,
      user
    );
    this.aUSDC = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      A_USDC,
      user
    );
    this.debtDAI = await hre.ethers.getContractAt(
      '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20',
      VARIABLE_DEBT_DAI,
      user
    );

    // Whale impersonation
    const whaleSigner = await ethers.getImpersonatedSigner(WHALE)

    // Set user & whale balance to 2 ETH
    await ethers.provider.send("hardhat_setBalance", [
      user.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    await ethers.provider.send("hardhat_setBalance", [
      whaleSigner.address,
      "0x1BC16D674EC80000", // 2 ETH (ETH -> WEI -> Hexdecimal)
    ]);

    // Transfer USDC to the user
    await this.usdc.connect(whaleSigner).transfer(user.address, USER_USDC_BALANCE);
    // Burn DAI balance form the user (somehow this signer has DAI on mainnet lol)
    await this.dai.connect(user).transfer(
      "0x000000000000000000000000000000000000dEaD", await this.dai.balanceOf(user.address)
    );
  })

  it("Student Tests", async () => {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Deploy AaveUser contract
    const AaveUserFactory = await ethers.getContractFactory(
      'contracts/money-markets-1/AaveUser.sol:AaveUser',
      user
    );
    this.aaveUser = await AaveUserFactory.deploy(AAVE_POOL, USDC, DAI);
    

    // TODO: Appove and deposit 1000 USDC tokens
    await this.usdc.approve(this.aaveUser.address, AMOUNT_TO_DEPOSIT)
    await this.aaveUser.depositUSDC(AMOUNT_TO_DEPOSIT)


    // TODO: Validate that the depositedAmount state var was changed
    expect(await this.aaveUser.depositedAmount()).to.eq(AMOUNT_TO_DEPOSIT);
    
    // TODO: Validate that your contract received the aUSDC tokens (receipt tokens)
    expect(await this.aUSDC.balanceOf(this.aaveUser.address)).to.eq(AMOUNT_TO_DEPOSIT);
    

    // TODO: borrow 100 DAI tokens
    await this.aaveUser.borrowDAI(AMOUNT_TO_BORROW);
    
    
    // TODO: Validate that the borrowedAmount state var was changed
    expect(await this.aaveUser.borrowedAmount()).to.eq(AMOUNT_TO_BORROW)
    
    // TODO: Validate that the user received the DAI Tokens
    expect(await this.dai.balanceOf(user.address)).to.eq(AMOUNT_TO_BORROW)
    
    // TODO: Validate that your contract received the DAI variable debt tokens
    expect(await this.debtDAI.balanceOf(this.aaveUser.address)).to.eq(AMOUNT_TO_BORROW)
    
    
    // TODO: Repay all the DAI
    await this.dai.approve(this.aaveUser.address, AMOUNT_TO_BORROW);
    await this.aaveUser.repayDAI(AMOUNT_TO_BORROW)
    

    // TODO: Validate that the borrowedAmount state var was changed
    expect(await this.aaveUser.borrowedAmount()).to.eq(0)

    // TODO: Validate that the user doesn't own the DAI tokens
    expect(await this.dai.balanceOf(user.address)).to.eq(0)

    // TODO: Validate that your contract own much less DAI Variable debt tokens (less then 0.1% of borrowed amount)
    // Note: The contract still supposed to own some becuase of negative interest
    expect(await this.debtDAI.balanceOf(this.aaveUser.address)).to.be.lt(
      AMOUNT_TO_BORROW.mul(1).div(1000)
    )
    
    // TODO: Withdraw all your USDC
    await this.aaveUser.withdrawUSDC(AMOUNT_TO_DEPOSIT);

    
    // TODO: Validate that the depositedAmount state var was changed
    expect(await this.aaveUser.depositedAmount()).to.eq(0);

    // TODO: Validate that the user got the USDC tokens back
    expect(await this.usdc.balanceOf(user.address)).to.eq(USER_USDC_BALANCE)

    // TODO: Validate that your contract own much less aUSDC receipt tokens (less then 0.1% of deposited amount)
    // Note: The contract still supposed to own some becuase of the positive interest
    expect(await this.aUSDC.balanceOf(this.aaveUser.address)).to.be.lt(
      AMOUNT_TO_DEPOSIT.mul(1).div(1000)
    )
  })

});