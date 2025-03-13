import { expect } from "chai";
import { ethers } from "hardhat";

import { Exponential } from "../../typechain-types";

describe("Exponential Contract", function () {
  let exponential: any;
  let owner: any;
  const expScale = 1000000000000000000n;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    // Deploy the Exponential contract
    exponential = await ethers.deployContract("Exponential");
  });

  it("should correctly compute getExp using (a/scale) / (b/scale) = a/b", async function () {
    const a = 10n;
    const b = 2n;

    // Expected result: a / b = 10 / 2 = 5
    const expectedMantissa = a / b * expScale;

    const [error, exp] = await exponential.getExp(a, b);

    expect(error).to.equal(0); // No error
    expect(exp.mantissa).to.equal(expectedMantissa); // a / b should be 5e18
  });

  it("should return zero mantissa for division by zero", async function () {
    const a = 10n;
    const b = 0; // Division by zero

    const [error, exp] = await exponential.getExp(a * expScale, b);

    expect(error).to.not.equal(0); // Should return an error
    expect(exp.mantissa).to.equal(0); // Should return zero mantissa
  });

  it("should correctly compute a fraction (3/4 = 0.75)", async function () {
    const a = 3n;
    const b = 4n;

    // Expected result: a / b = 3 / 4 = 0.75
    const expectedMantissa = (a * expScale * expScale) / b * expScale / expScale;

    const [error, exp] = await exponential.getExp(a * expScale, b);

    expect(error).to.equal(0);
    expect(exp.mantissa).to.equal(expectedMantissa); // 0.75e18
  });
});