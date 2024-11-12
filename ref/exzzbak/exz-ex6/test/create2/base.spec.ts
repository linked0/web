import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { Wallet, concat, AbiCoder } from "ethers";
import { ethers } from "hardhat";

import { fullSuiteFixture } from "./full-suite.fixture";

describe("ExecAccount", function () {
  const provider = ethers.provider;

  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      const {
        accounts: { deployer, user },
        suite: { execAccount },
      } = await loadFixture(fullSuiteFixture);

      console.log(execAccount.target);
      expect(await execAccount.test()).to.equal("Hello World!");
    });
  });
});