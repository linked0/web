import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

import { fullSuiteFixture } from "./full-suite.fixture";
import { hexlify } from "ethers";

describe("AllPairVault", function () {
  const provider = ethers.provider;

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment Lock and AllPairVault", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      await lock.add();
      expect(await lock.value()).to.equal(2n);

      const linkedListSetLib = await ethers.deployContract("LinkedListSetLib");
      console.log("LinkedListSetLib address: ", linkedListSetLib.target);
      const allPairVault = await ethers.deployContract("AllPairVault",
        [lock.target],
        {
          libraries: {
            LinkedListSetLib: linkedListSetLib.target,
          },
        });

      console.log("AllPairVault address: ", allPairVault.target);

      await allPairVault.createLock(1);
      expect(await allPairVault.getValue()).to.equal(1n);
    });
  });

  describe("ListSetStore", function () {
    it("Should deploy ListSetStore", async function () {
      const {
        accounts: { deployer, user },
        suiteAllPairVault: { allPairVault, lock },
      } = await loadFixture(fullSuiteFixture);

      // await lock.add();
      // expect(await lock.value()).to.equal(2n);
    });

    it("add and contains", async function () {
      const {
        accounts: { deployer, user },
        suiteAllPairVault: { allPairVault },
      } = await loadFixture(fullSuiteFixture);

      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "Example description"
      };

      const tx = await allPairVault.addValue(valueData);
      console.log(`TX: ${JSON.stringify(tx)}`);
      const receipt = await tx.wait();
      console.log(`Receipt: ${JSON.stringify(receipt)}`);
      expect(receipt.status).to.equal(1);

      // THE CODE TO CHECK !!!
      // const valueStr = ethers.toQuantity(valueData.value);
      // const hexStr = ethers.toBeHex(valueData.value);
      // console.log(`type of valueStr ${valueStr} ${typeof valueStr}`);
      // console.log(`type of hexStr: ${hexStr} ${typeof hexStr}`);
      // const byteArray = ethers.getBytes(valueStr);
      // const paddedHexValue = ethers.zeroPadValue(byteArray, 30);
      // expect(await listSetStore.contains(paddedHexValue)).to.equal(true);

      const hexStr = ethers.toBeHex(valueData.value, 30);
      console.log(`type of hexStr: ${hexStr} ${typeof hexStr}`);
      const byteArray = ethers.getBytes(hexStr);
      expect(await allPairVault.contains(byteArray)).to.equal(true);
    });

    it("add with checking event", async function () {
      const {
        accounts: { deployer, user },
        suiteAllPairVault: { allPairVault },
      } = await loadFixture(fullSuiteFixture);

      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: "Example description"
      };

      const userListSetStore = allPairVault.connect(user);
      expect(await userListSetStore.addValue(valueData))
        .to.emit(allPairVault, "ValueAdded")
        .withArgs(valueData.value, valueData.description);
    });

    it("add with revert", async function () {
      const {
        accounts: { deployer, user },
        suiteAllPairVault: { allPairVault },
      } = await loadFixture(fullSuiteFixture);

      // Create a ValueData object
      const valueData = {
        value: 123456, // Example uint240 value
        description: ""
      };

      const userListSetStore = allPairVault.connect(user);
      await expect(userListSetStore.addValue(valueData))
        .to.be.revertedWith("E000");
    });
  });
});
