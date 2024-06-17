import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Basic, BasicSimulation__factory } from "../typechain-types";
import { TransactionRequest } from "ethers";
import BasicSimulationJson from "../artifacts/contracts/BasicSimulation.sol/BasicSimulation.json";

describe("Call eth-call", function () {
  describe("Deployment", function () {
    let basic: Basic;
    before(async function () {
      basic = await ethers.deployContract("Basic");
    });

    it("Simple Test", async function () {
      console.log("basic:", basic.target);
      console.log("initial basic value:", await basic.value());
    });
  });

  describe("eth-call", async function () {
    let basic: Basic;
    before(async function () {
      basic = await ethers.deployContract("Basic");
      console.log("basic value:", await basic.value());
    });

    it("Call eth-call", async function () {
      const basicSimulation = BasicSimulation__factory.createInterface();
      const data = basicSimulation.encodeFunctionData("add");
      const targetAddress = basic.target;
      const tx: TransactionRequest = {
        to: targetAddress,
        data: data,
      };

      const stateOverride = {
        [targetAddress]: {
          code: BasicSimulationJson.deployedBytecode,
        },
      };

      const callResult = await ethers.provider.send("eth_call", [
        tx,
        "latest",
        stateOverride,
      ]);
      const res = await basicSimulation.decodeFunctionResult("add", callResult);
      console.log("res:", res);
      expect(res[0]).to.eq(99n);
    });
  });
});
