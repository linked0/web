import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { expect } from "chai";

module.exports =  buildModule("Zex", (m) => {
   // Deploy JaySmartAccount and BasicPlugin contracts
   const jsa = m.contract("JaySmartAccount");
   const basicPlugin = m.contract("BasicPlugin");
 
   return { jsa, basicPlugin };
});