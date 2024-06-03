import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { fullSuiteFixture } from "./full-suite.fixture";

describe("Basic test", () => {
  it("Should create new account", async () => {
    const {
      suite: { entryPoint, singleOwnerPlugin },
      accounts: { deployer, user },
    } = await loadFixture(fullSuiteFixture);

    console.log("Deployer address: ", deployer.address);
    console.log("Plugin address: ", singleOwnerPlugin.address);
  });
});