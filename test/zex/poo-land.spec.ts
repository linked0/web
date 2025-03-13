import { expect } from "chai";
import { ethers } from "hardhat";

import {
  PoolTerminal,
} from "../../typechain-types";
import { getBasicOrderParameters } from "../utils/Order";

import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"


describe("PoolTerminal", function () {
  let poolTerminal: PoolTerminal;
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();
    // Deploy using the new deployContract function. The deployer is provided as the third argument.
    poolTerminal = await ethers.deployContract("PoolTerminal", [10], deployer);
    await poolTerminal.waitForDeployment();
  });

  it("should deploy with the correct initial value", async function () {
    expect(await poolTerminal.get()).to.equal(10);
    expect(await poolTerminal.storedValue()).to.equal(10);
  });

  it("should update storedValue when set() is called", async function () {
    const tx = await poolTerminal.set(20);
    await expect(tx).to.emit(poolTerminal, "DataUpdated").withArgs(20);
    expect(await poolTerminal.get()).to.equal(20);
  });

  it("should call fullfillBasicOrder", async function () {
    const order = getBasicOrderParameters();
    console.log("order", order);
    
    // Call the function with a payable value (if required).
    const tx = await poolTerminal.fulfillBasicOrder(order, {
      value: ethers.parseEther("0.1"),
    });

    // Assert that the event BasicOrderFulfilled is emitted with the expected arguments.
    await expect(tx)
      .to.emit(poolTerminal, "BasicOrderFulfilled")
      .withArgs(deployer.address, true, 8);
  });
});
