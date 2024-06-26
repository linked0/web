import { expect } from "chai";
import { ethers } from "ethers-v5";
import hre from "hardhat";
import { Fixture, setup } from "./utils/setup";
import { AllBasic } from "../src";

describe("Basic test", () => {
  let fixture: Fixture;

  before(async () => {
    fixture = await setup();
  });

  it("should return true", () => {
    const { allBasic } = fixture;
  });
});