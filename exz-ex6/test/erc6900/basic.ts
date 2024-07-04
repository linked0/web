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

    console.log("EntryPoint address: ", entryPoint.target);
    console.log("SingleOwnerPlugin address: ", singleOwnerPlugin.target);
  });
});