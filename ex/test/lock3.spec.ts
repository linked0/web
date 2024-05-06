import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock3", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_GWEI = 1_000_000_000;
    const lockedAmount = ONE_GWEI;
    const lockValue = 2;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock3");
    const lock = await Lock.deploy(lockValue, { value: lockedAmount });

    return { lock, lockValue, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Test value set", async function () {
      const { lock, lockValue } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.value()).to.equal(lockValue);
    });
  });
});
