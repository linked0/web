import * as dotenv from "dotenv";
import chai, { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import {
  UniswapV2Router02,
  UniswapV2Pair,
  UniswapV2Factory,
  ERC20,
  IUniswapV2Pair__factory,
  UniswapV2Pair__factory,
  ExampleSwapToPrice,
} from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

dotenv.config({ path: ".env" });

const { MaxUint256 } = ethers;
const AddressZero = "0x0000000000000000000000000000000000000000";

const MINIMUM_LIQUIDITY = 1000n * 10n ** 18n;
const TOTAL_SUPPLY = 10000n * 10n ** 18n;

describe("ExampleSwapToPrice", () => {
  let token0: ERC20;
  let token1: ERC20;
  let pair: UniswapV2Pair;
  let factory: UniswapV2Factory;
  let wethPair: UniswapV2Pair;
  let swapToPriceExample: ExampleSwapToPrice;
  let router: UniswapV2Router02;
  let signers: HardhatEthersSigner[];
  let admin: HardhatEthersSigner;
  let accounts: string[];
  let pairAddress: string;

  beforeEach(async () => {
    // get signers
    signers = await ethers.getSigners();
    admin = signers[0];
    accounts = signers.map((s) => s.address);

    console.log("########################################");
    // deploy ERC20 tokens
    const tokenA = await ethers.deployContract("ERC20", [TOTAL_SUPPLY]);
    await tokenA.waitForDeployment();
    console.log("tokenA address:", tokenA.target);

    // deploy ERC20 tokens
    const tokenB = await ethers.deployContract("ERC20", [TOTAL_SUPPLY]);
    await tokenB.waitForDeployment();
    console.log("tokenB address:", tokenB.target);

    // deploy WETH
    const weth = await ethers.deployContract("WETH9", []);

    // deploy WETHPartner
    const wethPartner = await ethers.deployContract("ERC20", [TOTAL_SUPPLY]);

    // deploy UniswapV2Factory
    factory = await ethers.deployContract("UniswapV2Factory", [accounts[0]]);
    await factory.waitForDeployment();
    console.log("factory address:", factory.target);

    // deploty UniswapV2Router02
    router = await ethers.deployContract("UniswapV2Router02", [
      factory.target,
      weth.target,
    ]);

    // event emitter for testing
    const routerEventEmitter = ethers.deployContract("RouterEventEmitter", []);

    // deploy migrator
    const migrator = await ethers.deployContract("UniswapV2Migrator", [
      factory.target,
      router.target,
    ]);

    // initialize V2
    await factory.createPair(tokenA.target, tokenB.target);
    pairAddress = await factory.getPair(tokenA.target, tokenB.target);
    const pairContract = new Contract(
      pairAddress,
      JSON.stringify(IUniswapV2Pair__factory.abi),
      ethers.provider
    );
    pair = UniswapV2Pair__factory.connect(pairAddress, admin);
    console.log("pairAddress:", pairAddress);
    console.log("pair contract:", pairContract.target);
    console.log("pair target:", pair.target);

    const token0Address = await pair.token0();
    token0 = tokenA.target === token0Address ? tokenA : tokenB;
    token1 = tokenA.target === token0Address ? tokenB : tokenA;

    await factory.createPair(weth.target, wethPartner.target);
    const wethPairAddress = await factory.getPair(
      weth.target,
      wethPartner.target
    );
    const wethPairContract = new Contract(
      wethPairAddress,
      JSON.stringify(IUniswapV2Pair__factory.abi),
      ethers.provider
    );
    wethPair = UniswapV2Pair__factory.connect(wethPairAddress, admin);
  });

  beforeEach(async function () {
    swapToPriceExample = await ethers.deployContract("ExampleSwapToPrice", [
      factory.target,
      router.target,
    ]);
  });

  beforeEach("set up price differential of 1:100", async () => {
    await token0.transfer(pairAddress, 10n * 10n ** 18n);
    await token1.transfer(pairAddress, 1000n * 10n ** 18n);
    await pair.sync();
  });

  beforeEach(
    "approve the swap contract to spend any amount of both tokens",
    async () => {
      await token0.approve(swapToPriceExample.target, MaxUint256);
      await token1.approve(swapToPriceExample.target, MaxUint256);
    }
  );

  it("correct router address", async () => {
    console.log("router address:", router.target);
    expect(await swapToPriceExample.router()).to.eq(router.target);
  });

  describe("#swapToPrice", () => {
    it("requires non-zero true price inputs", async () => {
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          0,
          0,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      ).to.be.revertedWith("ExampleSwapToPrice: ZERO_PRICE");
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          10,
          0,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      ).to.be.revertedWith("ExampleSwapToPrice: ZERO_PRICE");
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          0,
          10,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      ).to.be.revertedWith("ExampleSwapToPrice: ZERO_PRICE");
    });

    it("requires non-zero max spend", async () => {
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          1,
          100,
          0,
          0,
          accounts[0],
          MaxUint256
        )
      ).to.be.revertedWith("ExampleSwapToPrice: ZERO_SPEND");
    });

    it("moves the price to 1:90", async () => {
      console.log("token0, token1:", token0.target, token1.target);
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          1,
          90,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      )
        // (1e19 + 526682316179835569) : (1e21 - 49890467170695440744) ~= 1:90
        .to.emit(token0, "Transfer")
        .withArgs(accounts[0], swapToPriceExample.target, "526682316179835569")
        .to.emit(token0, "Approval")
        .withArgs(
          swapToPriceExample.target,
          router.target,
          "526682316179835569"
        )
        .to.emit(token0, "Transfer")
        .withArgs(swapToPriceExample.target, pair.target, "526682316179835569")
        .to.emit(token1, "Transfer")
        .withArgs(pair.target, accounts[0], "49890467170695440744");
    });

    it("moves the price to 1:110", async () => {
      await expect(
        swapToPriceExample.swapToPrice(
          token0.target,
          token1.target,
          1,
          110,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      )
        // (1e21 + 47376582963642643588) : (1e19 - 451039908682851138) ~= 1:110
        .to.emit(token1, "Transfer")
        .withArgs(
          accounts[0],
          swapToPriceExample.target,
          "47376582963642643588"
        )
        .to.emit(token1, "Approval")
        .withArgs(
          swapToPriceExample.target,
          router.target,
          "47376582963642643588"
        )
        .to.emit(token1, "Transfer")
        .withArgs(
          swapToPriceExample.target,
          pair.target,
          "47376582963642643588"
        )
        .to.emit(token0, "Transfer")
        .withArgs(pair.target, accounts[0], "451039908682851138");
    });

    it.skip("reverse token order", async () => {
      await expect(
        swapToPriceExample.swapToPrice(
          token1.target,
          token0.target,
          110,
          1,
          MaxUint256,
          MaxUint256,
          accounts[0],
          MaxUint256
        )
      )
        // (1e21 + 47376582963642643588) : (1e19 - 451039908682851138) ~= 1:110
        .to.emit(token1, "Transfer")
        .withArgs(
          accounts[0],
          swapToPriceExample.target,
          "47376582963642643588"
        )
        .to.emit(token1, "Approval")
        .withArgs(
          swapToPriceExample.target,
          router.target,
          "47376582963642643588"
        )
        .to.emit(token1, "Transfer")
        .withArgs(
          swapToPriceExample.target,
          pair.target,
          "47376582963642643588"
        )
        .to.emit(token0, "Transfer")
        .withArgs(pair.target, accounts[0], "451039908682851138");
    });

    it.skip("swap gas cost", async () => {
      const tx = await swapToPriceExample.swapToPrice(
        token0.target,
        token1.target,
        1,
        110,
        MaxUint256,
        MaxUint256,
        accounts[0],
        MaxUint256
      );
      const receipt = await tx.wait();
      expect(receipt?.gasUsed).to.eq("115129");
    }).retries(2); // gas test is inconsistent
  });
});
