import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Wallet, concat, AbiCoder } from "ethers";


import { fullSuiteFixture } from "./full-suite.fixture";
import type { FullSuiteFixtures } from "./full-suite.fixture";

describe.only("AllPairVault", () => {
  let allBasic: FullSuiteFixtures["allBasic"];
  const provider = ethers.provider;

  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      const execAccountFactory = await ethers.getContractFactory("ExecAccount");
      const execAccount = await execAccountFactory.deploy();
      await execAccount.deployed();

      console.log("Test ExecAccount");
      console.log(execAccount.address);
      expect(await execAccount.test()).to.equal("Hello World!");
    });
  });

  describe.only("AllBasic", function () {
    before(async () => {
      ({ allBasic } = await fullSuiteFixture());
    });

    it("get value", async function () {
      console.log("AllBasic address: ", allBasic.address);
      expect(await allBasic.getValue()).to.equal(1n);
    });
  });
});