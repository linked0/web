import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { JaySmartAccount } from "../../typechain-types";

import { UserOperation } from "./UserOperation";

describe("Jay Smart Account", () => {
  let jaySmartAccount: JaySmartAccount;
  let owner: Signer;
  let user: Signer;
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  before(async () => {
    [owner, user] = await ethers.getSigners();
    jaySmartAccount = await ethers.deployContract("JaySmartAccount");
    await jaySmartAccount.waitForDeployment();
  });

  it("should have the correct error value", async () => {
    expect(await jaySmartAccount.getSigValidationFailed()).to.equal(1);
  });

  it("should pass validation with correct signature", async () => {
    const op: UserOperation = {
      sender: await user.getAddress(),
      signature: "0x",
    };

    const { sender, signature } = op;
    const userOpHash = ethers.keccak256(
      abiCoder.encode(["address", "bytes"], [sender, signature])
    );
    const validationData = await jaySmartAccount.validateUserOp.staticCall(op, userOpHash);
    expect(validationData).to.equal(0);
  });
});
