import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { JaySmartAccount } from "../../typechain-types";

describe("Jay Smart Account", () => {
  let jaySmartAccount: JaySmartAccount;
  let owner: Signer;
  let user: Signer;

  before(async () => {
    [owner, user] = await ethers.getSigners();
    jaySmartAccount = await ethers.deployContract("JaySmartAccount");
    jaySmartAccount.waitForDeployment();
  });

  it("should have the correct error value", async () => {
    expect(await jaySmartAccount.getSigVAlidationFailed()).to.equal(1);
  });
});
