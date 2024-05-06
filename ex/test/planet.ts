import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFullSuiteFixture } from "./fixtures/deploy-full-suite.fixture";

describe("Basic", () => {
  it("Basic Test", async () => {
    const {
      suite: { greeter, basic },
      accounts: { deployer, user },
    } = await loadFixture(deployFullSuiteFixture);
    console.log("greeter:", await greeter.greet());

    console.log("basic address:", basic.target);
    console.log("basic:", await basic.value());
  });
});
