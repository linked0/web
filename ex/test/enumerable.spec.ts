import { ethers } from "hardhat";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
describe("Enumerable", async function () {
   before (async function () {

   });
   it("should be able to enumerate", async function () {
       const [owner, otherAccount] = await ethers.getSigners();
       const EnumerableSetTest = await ethers.getContractFactory("EnumerableSetTest");
       const eTest = await EnumerableSetTest.deploy();
       const maxValue = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;
       console.log("typeof maxValue", typeof maxValue);
       await eTest.add(maxValue);
       expect(await eTest.contains(maxValue)).to.equal(true);
       expect(await eTest.lastValue()).to.equal(maxValue);

       console.log("test");
   });
});