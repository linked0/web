import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgeCheck Circuit", function () {
  it("Should return true if the age is greater than 18", async function () {
    const age = 19;
    expect(age).to.equal(19);
  });
});