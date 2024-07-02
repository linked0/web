import { expect } from "chai";
import { ethers } from "hardhat";

describe("Example Test", function () {
  it("Should deploy a contract and verify mining settings", async function () {
    const [owner] = await ethers.getSigners();

    const blockNumberPrev = await ethers.provider.getBlockNumber();
    console.log("blockNumberPrev: ", blockNumberPrev);

    // Deploy a simple contract
    const Example = await ethers.getContractFactory("AllBasic");
    const example = await Example.deploy();

    // with TEST_MODE=disableAutoMining, It will take so long
    await example.waitForDeployment();

    // Verify that the contract was deployed by checking its address
    expect(example.target).to.properAddress;

    const blockNumberAfter = await ethers.provider.getBlockNumber();
    console.log("blockNumberAfter: ", blockNumberAfter);
  });
});