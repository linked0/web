import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { DMSToken, Lock2 } from "../../typechain-types";
import { sign } from "crypto";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe.skip("Lock2", function () {
  let lock2: Lock2;
  let dmsToken: DMSToken;
  let signers: SignerWithAddress[];
  let accounts: string[];

  before(async function () {
    signers = await ethers.getSigners();
    accounts = signers.map((signer) => signer.address);
    await deployments.fixture("Lock2");
    const deploy = await deployments.get("Lock2");
    lock2 = await ethers.getContractAt("Lock2", deploy.address);
    const dmsTokenDeploy = await deployments.get("DMSToken");
    dmsToken = await ethers.getContractAt("DMSToken", dmsTokenDeploy.address);
    console.log("lock2:", lock2.target);
    console.log("dmsToken:", dmsToken.target);
  });

  it("Get unlockTime", async function () {
    console.log("unlockTime:", await lock2.unlockTime());
  });

  it("keccak256", async function () {
    // Convert the string to a format compatible with BytesLike
    const data = ethers.toUtf8Bytes("isValidSignature(bytes32,bytes)");

    // Calculate the hash
    const hash = ethers.keccak256(data);

    console.log("hash:", hash);
  });

  it("getBalance", async function () {
    console.log("balance:", await dmsToken.balanceOf(accounts[1]));
    // TODO: add expect test code
  });
});
