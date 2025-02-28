import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { expect } from "chai";

module.exports =  buildModule("Zex", (m) => {
  const jsa = m.contract("JaySmartAccount");
  const result = m.staticCall(jsa, "getSigValidationFailed", []);

  return { jsa };
});