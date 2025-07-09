import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { fullSuiteTestTokenFixture } from "./full-suite-test-token.fixture";

describe("TransactionDelegator", () => {
  describe("mint", async () => {
    it("Should mint tokens", async function () {
      const {
        suite: { erc20, delegator },
        accounts: { deployer, user },
      } = await loadFixture(fullSuiteTestTokenFixture);

      const id = 1;
      expect(await delegator.mint(user.address, id))
        .to.emit(erc20, "Mint")
        .withArgs(user.address, ethers.parseEther("1"));
    });
  });
  describe("getStatus", async () => {
    it("Should get status SUCCESS", async function () {
      const {
        suite: { erc20, delegator },
        accounts: { user },
      } = await loadFixture(fullSuiteTestTokenFixture);

      const id = 1;
      expect(await delegator.mint(user.address, id))
        .to.emit(erc20, "Mint")
        .withArgs(user.address, ethers.parseEther("1"));

      expect(await delegator.getStatus(user.address, id)).to.equal(1);
    });

    it("Should get status PENDING", async function () {
      const {
        suite: { delegator },
        accounts: { user },
      } = await loadFixture(fullSuiteTestTokenFixture);

      const id = 1;
      delegator.mint(user.address, id);

      expect(await delegator.getStatus(user.address, id)).to.equal(0);
    });

    it("Should mint multiple times", async function () {
      const {
        suite: { delegator },
        accounts: { user },
      } = await loadFixture(fullSuiteTestTokenFixture);

      const id = 1;
      delegator.mint(user.address, id);

      const id2 = 2;
      await delegator.mint(user.address, id2);

      // elapsed blocks
      await ethers.provider.send("evm_mine", []);

      expect(await delegator.getStatus(user.address, id)).to.equal(1);
      expect(await delegator.getStatus(user.address, id2)).to.equal(1);
    });
  });
});
