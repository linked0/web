import { ethers } from 'hardhat'
import { expect } from 'chai'

const provider = ethers.provider

describe("ExecAccount", function () {
  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      const execAccountFactory = await ethers.getContractFactory("ExecAccount");
      const execAccount = await execAccountFactory.deploy();

      console.log("Test ExecAccount");
      console.log(execAccount.address);
      expect(await execAccount.test()).to.equal("Hello World!");
    });
  });
});