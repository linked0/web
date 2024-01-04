import { ethers } from "hardhat";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
describe.only("Enumerable", async function () {
   before (async function () {

   });
   it("should be able to enumerate", async function () {
       const [owner, otherAccount] = await ethers.getSigners();
       const EnumerableSetTest = await ethers.getContractFactory("EnumerableSetTest");
       const eTest = await EnumerableSetTest.deploy();
       await eTest.add(1);
       expect(await eTest.contains(1)).to.equal(true);

       console.log("test");
   });
});