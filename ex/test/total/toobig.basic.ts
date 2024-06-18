import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Wallet, Signer } from "ethers";
import { BigNumber, constants, utils } from "ethers";
import { ExecAccount, Operator, TooBig, JayTestLib } from '../../typechain';
import { defaultAbiCoder, hexConcat, arrayify, formatBytes32String } from 'ethers/lib/utils';
import { buildOrderStatus } from "../utils";

import { fullSuiteFixture } from "../full-suite.fixture";
import type { FullSuiteFixtures } from "../full-suite.fixture";
import { libraries } from "../../typechain/contracts";

describe("TooBig contract", () => {
  const provider = ethers.provider;

  let tooBig: TooBig;
  let jayTestLib: JayTestLib;
  let signer: Signer;

  beforeEach(async () => {
    const JayTestLib = await ethers.getContractFactory("JayTestLib");
    jayTestLib = await JayTestLib.deploy();
    await jayTestLib.deployed();
    console.log(jayTestLib.address);

    // const TooBig = await ethers.getContractFactory("TooBig");
    const TooBig = await ethers.getContractFactory("TooBig", { libraries: { JayTestLib: jayTestLib.address } });
    tooBig = await TooBig.deploy();
    console.log(tooBig.address);
    signer = provider.getSigner()
  });

  it("should deploy TooBig", async () => {
    expect(await tooBig.getValue()).to.equal(0);

    // Get the bytecode of the deployed contract
    const contractCode = await provider.getCode(tooBig.address);

    // Calculate the size of the contract's bytecode
    const contractSize = (contractCode.length - 2) / 2; // Subtract 2 for '0x' prefix and divide by 2 to get the byte count
    console.log("Contract size: ", contractSize);
  });
});
