import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { expect } from "chai";

module.exports =  buildModule("ZexV2", (m) => {
   // Deploy JaySmartAccount and BasicPlugin contracts
   const jsaV2 = m.contract("JaySmartAccountV2");
 
   return { jsaV2 };
});