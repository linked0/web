import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

import { fullSuiteFixture } from "./full-suite.fixture";
import { hexlify } from "ethers";

describe("DataStorage", function () {
  const provider = ethers.provider;

  describe("Deployment DataStorage", function () {
    it("Should deploy DataStorage", async function () {
      const {
        accounts: { deployer, user },
        suite: { dataStorage },
      } = await loadFixture(fullSuiteFixture);

      console.log(dataStorage.target);
    });

    it("Should set and get the right real value", async function () {
      const {
        accounts: { deployer, user },
        suite: { dataStorage },
      } = await loadFixture(fullSuiteFixture);

      // Create a ValueData object
      const valueData = {
        name: "Example data storage",
        value: 123456,
      };

      expect(await dataStorage.setData(valueData)).to.emit(dataStorage, "DataStored").withArgs([valueData.name, valueData.value]);
      await provider.send("evm_mine", []);
      expect(await dataStorage.getDataValue(valueData.name)).to.equal(valueData.value);
    });

    it("Should set and get the right value", async function () {
      const {
        accounts: { deployer, user },
        suite: { dataStorage },
      } = await loadFixture(fullSuiteFixture);

      // Create a ValueData object
      const valueData = {
        name: "Hello World Series Otani! Ryu! Ichiro! Shohei! Kikuchi! Sugano! Yamada! Sasaki*",
        value: 123456,
      };

      expect(await dataStorage.setData(valueData)).to.emit(dataStorage, "DataStored").withArgs([valueData.name, valueData.value]);
      await provider.send("evm_mine", []);
      const returnData = await dataStorage.getData(valueData.name)
      console.log(returnData);
    });
  });
});