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
      const network = await provider.getNetwork();
      if (Number(network.chainId) == 31337) {
        console.log("Skip for local network");
        return;
      }

      const adminKey = process.env.ADMIN_KEY || "";
      const userKey = process.env.USER_KEY || "";
      const adminWallet = new Wallet(adminKey, ethers.provider);
      const userWallet = new Wallet(userKey, ethers.provider);
      const receipt = await adminWallet.sendTransaction({
        to: userWallet.address,
        value: ethers.parseEther("1.0"),
      });
      console.log(receipt);
    });

  });
});
