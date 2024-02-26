import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  import { Basic, Basic__factory } from "../typechain-types";
import { TransactionRequest } from "ethers";
  
  describe("Call eth-call", function () {
    describe("Deployment", function () {
      let basic: Basic;
      before (async function () {
        basic = await ethers.deployContract("Basic");
      });
  
      it("Simple Test", async function () {
        console.log("basic:", basic.target);
        console.log("initial basic value:", await basic.value());
      });
    });

    describe("eth-call", async function () {
      let basic: Basic;
      before (async function () {
        basic = await ethers.deployContract("Basic");
        console.log("basic value:", await basic.value());
      });

      it("Call eth-call", async function () {
        const basicInterface = Basic__factory.createInterface();
        const data = basicInterface.encodeFunctionData("add");
        const tx: TransactionRequest = {
          to: basic.target,
          data: data,
        };
        const callResult = await ethers.provider.send("eth_call", [tx, "latest"]);
        const res = await basicInterface.decodeFunctionResult("add", callResult);
        expect(res[0]).to.eq(1n);
      });

      it("Call value function (actuall property) and not changed ", async function () {
        expect(await basic.value()).to.eq(0);
      });
    });

  });
  