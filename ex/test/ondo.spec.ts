import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { PLib } from "../typechain-types";

describe("Ondo", function () {
  let poohLib: PLib;
  before(async function () {
    // deploy library contract
    const pLib = await ethers.getContractFactory("PLib");
    poohLib = await pLib.deploy();
    console.log("PoohLibrary deployed to:", poohLib.target);
  });
  it("Should return the new greeting once it's changed", async function () {
    const Ondo = await ethers.getContractFactory("Ondo", {
      libraries: {
        PLib: poohLib.target,
      },
    });
    const ondo = await Ondo.deploy();
    console.log("Ondo deployed to:", ondo.target);
  });
});
