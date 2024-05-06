import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Basic } from "../typechain-types";

describe("Basic Test", function () {
  let basic: Basic;
  before(async function () {
    basic = await ethers.deployContract("Basic");
  });
  describe("EnumerableSet", function () {
    it("Call contract having EnurableSet", async function () {
      console.log("basic address:", basic.target);
      console.log("basic:", await basic.value());
    });
  });
});
