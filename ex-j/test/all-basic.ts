import { expect } from "chai";
import { ethers } from "ethers-v5";
import hre from "hardhat";
import { fullSuiteFixture } from "./utils/full-suite.fixture";
import { AllBasic } from "../src";

import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Basic test", () => {
  it("should return true", async () => {
    const {
      suiteBasic: { allBasic },
    } = await loadFixture(fullSuiteFixture);

    console.log("getValue:", await allBasic.getValue());
  });
});