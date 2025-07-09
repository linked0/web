import { ethers } from "hardhat";
import { expect } from "chai";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";

describe("ContractFactory", function () {
  async function greeterFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    return { owner, otherAccount };
  }

  it("Should return the new contract instance", async function () {
    const Factory = await ethers.getContractFactory("Greeter");
    const greeter = await Factory.deploy("Hello, Hardhat!");

    console.log("Greeter deployed to:", greeter.target);

    expect(await greeter.greet()).to.equal("Hello, Hardhat!");
  });

  it("Should create a new contract instance with ethers.ContractFactory", async function () {
    const { owner } = await greeterFixture();
    const greeter = await new ethers.ContractFactory(
      Greeter.abi,
      Greeter.bytecode,
      owner,
    ).deploy("Hello, Hardhat!");

    const contract = await ethers.getContractAt(
      "Greeter",
      greeter.target,
      owner,
    );
    expect(await contract.greet()).to.equal("Hello, Hardhat!");
  });
});
