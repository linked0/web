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

  describe("AllBasic", function () {
    it("Should deploy AllBasic", async function () {
      const {
        suiteBasic: { allBasic },
      } = await loadFixture(fullSuiteFixture);

      expect(await allBasic.getValue()).to.equal(1n);
    });
  });

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

      await lock.add();
      expect(await lock.value()).to.equal(2n);
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
      expect(receipt?.status).to.equal(1);

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

  describe("send and sendTransaction", function () {
    it("Should succeed for personal_unlocalAccount", async function () {
      const network = await provider.getNetwork();
      if (Number(network.chainId) == 31337) {
        console.log("Skip for local network");
        return;
      }
      const userKey = process.env.USER_KEY || "";
      const userWallet = new Wallet(userKey, ethers.provider);
      const privateKeyPassword = process.env.PRIVATE_KEY_PASSWORD || "";
      const unlock = await provider.send("personal_unlockAccount", [
        userWallet.address,
        privateKeyPassword,
        0,
      ]);
      console.log(unlock);
    });

    it("Should succeed for personal_unlocalAccount with admin wallet", async function () {
      const network = await provider.getNetwork();
      if (Number(network.chainId) == 31337) {
        console.log("Skip for local network");
        return;
      }

      const adminKey = process.env.ADMIN_KEY || "";
      const userKey = process.env.USER_KEY || "";
      const adminWallet = new Wallet(adminKey, ethers.provider);
      const userWallet = new Wallet(userKey, ethers.provider);
      const privateKeyPassword = process.env.PRIVATE_KEY_PASSWORD || "";

      // NOTE:It will succeeded even though there is red underline under the code
      const unlock_response = await adminWallet.provider.send("personal_unlockAccount", [
        userWallet.address,
        privateKeyPassword,
        0 // unlock duration in seconds, 0 for indefinite
      ]);
      console.log(unlock_response);
    });

    it("Should succeed for sendTransaction", async function () {
      const adminKey = process.env.ADMIN_KEY || "";
      const userKey = process.env.USER_KEY || "";
      const adminWallet = new Wallet(adminKey, ethers.provider);
      const userWallet = new Wallet(userKey, ethers.provider);

      const [owner] = await ethers.getSigners();
      const amount = ethers.parseEther("2.0");
      const tx = await owner.sendTransaction({
        to: adminWallet.address,
        value: amount,
      });
      await tx.wait();

      const receipt = await adminWallet.sendTransaction({
        to: userWallet.address,
        value: ethers.parseEther("1.0"),
      });
      console.log(receipt);
    });

  });
});
