import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { JaySmartAccount, BasicPlugin, PoolTerminal } from "../../typechain-types";
import { getBasicOrderParameters } from "../utils/Order";

import { encodePluginManifest, PluginManifest } from "./PluginManifest";
import { UserOperation } from "./UserOperation";

describe("ZEX TEXT CASES", () => {
  describe("### Jay Smart Account", () => {
    let jaySmartAccount: JaySmartAccount;
    let basicPlugin: BasicPlugin;
    let owner: Signer;
    let user: Signer;
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  
    before(async () => {
      [owner, user] = await ethers.getSigners();
      jaySmartAccount = await ethers.deployContract("JaySmartAccount");
      await jaySmartAccount.waitForDeployment();
  
      // Deploy the BasicPlugin contract using ethers v6 deployContract.
      basicPlugin = await ethers.deployContract("BasicPlugin", { signer: owner });
      await basicPlugin.waitForDeployment();
    });
  
    it("should have the correct error value", async () => {
      expect(await jaySmartAccount.getSigValidationFailed()).to.equal(1);
    });
  
    it("should pass validation with correct signature", async () => {
      const op: UserOperation = {
        sender: await user.getAddress(),
        signature: "0x",
      };
  
      const { sender, signature } = op;
      const userOpHash = ethers.keccak256(
        abiCoder.encode(["address", "bytes"], [sender, signature])
      );
      const validationData = await jaySmartAccount.validateUserOp.staticCall(op, userOpHash);
      expect(validationData).to.equal(0);
    });
  
    it("should return a valid PluginManifest with the expected interface ID", async function () {
      // Call the pluginManifest function on the deployed contract.
      const manifest = await basicPlugin.pluginManifest();
  
      // Check that the manifest's interfacerIds array has a length of 1.
      expect(manifest.interfaceIds.length).to.equal(1);
  
      // Check that the first interface ID is 0x01ffc9a7.
      expect(manifest.interfaceIds[0]).to.equal("0x01ffc9a7");
    });
  
    it("should call installPlugin and return the correct plugin address", async function () {
      // Create the manifest hash (or use the relevant logic if manifest is already a hash
      const manifestPlugin: PluginManifest = await basicPlugin.pluginManifest();
      const manifest = {
        name: manifestPlugin.name,
        version: manifestPlugin.version,
        author: manifestPlugin.author,
        reserves: [...manifestPlugin.reserves],
        interfaceIds: [...manifestPlugin.interfaceIds],
      };
      const manifestHash = ethers.keccak256(abiCoder.encode(
        ['string', 'uint256', 'string'],
        [manifest.name, manifest.version, manifest.author]
      ));
      const encoded = encodePluginManifest(manifest);
  
      // Call the installPlugin function on the JaySmartAccount contract.
      const tx = await jaySmartAccount.installPlugin(
        basicPlugin.target,
        manifestHash,
        manifest,
        encoded,
        true
      );
  
      // Wait for the transaction to be mined.
      const result = await tx.wait();
      expect(result!.status).to.equal(
        1,
        "The transaction should be successful"  // Error message
      );
  
      // Get the plugin address with getPluginAddress function.
      const pluginAddress = await jaySmartAccount.getPluginAddress(0);
      console.log("pluginAddress:", pluginAddress);
      expect(pluginAddress).to.equal(basicPlugin.target);
  
      // Get the plugin data with address
      const pluginData = await jaySmartAccount.getPluginData(pluginAddress);
      console.log("pluginData:", pluginData);
      expect(pluginData.manifestHash).to.equal(manifestHash);
    });
  
    it("should call installPlugin with copyObject false and return the correct plugin address", async function () {
      // Create the manifest hash (or use the relevant logic if manifest is already a hash
      const manifestPlugin: PluginManifest = await basicPlugin.pluginManifest();
      const manifest = {
        name: manifestPlugin.name,
        version: manifestPlugin.version,
        author: manifestPlugin.author,
        reserves: [...manifestPlugin.reserves],
        interfaceIds: [...manifestPlugin.interfaceIds],
      };
      const manifestHash = ethers.keccak256(abiCoder.encode(
        ['string', 'uint256', 'string'],
        [manifest.name, manifest.version, manifest.author]
      ));
      const encoded = encodePluginManifest(manifest);
  
      // Call the installPlugin function on the JaySmartAccount contract.
      const tx = await jaySmartAccount.installPlugin(
        basicPlugin.target,
        manifestHash,
        manifest,
        encoded,
        false
      );
  
      // Wait for the transaction to be mined.
      const result = await tx.wait();
      expect(result!.status).to.equal(
        1,
        "The transaction should be successful"  // Error message
      );
  
      // Get the plugin address with getPluginAddress function.
      const pluginAddress = await jaySmartAccount.getPluginAddress(0);
      console.log("pluginAddress:", pluginAddress);
      expect(pluginAddress).to.equal(basicPlugin.target);
  
      // Get the plugin data with address
      const pluginData = await jaySmartAccount.getPluginData(pluginAddress);
      console.log("pluginData:", pluginData);
      expect(pluginData.manifestHash).to.equal(manifestHash);
    });
  
    it("reverts on invalid plugin version", async function () {
      // Create the manifest hash (or use the relevant logic if manifest is already a hash
      const manifestPlugin: PluginManifest = await basicPlugin.pluginManifest();
      const manifest: PluginManifest = {
        name: manifestPlugin.name,
        version: 1_00_01n,
        author: manifestPlugin.author,
        reserves: [...manifestPlugin.reserves],
        interfaceIds: [...manifestPlugin.interfaceIds],
      };
      const manifestHash = ethers.keccak256(abiCoder.encode(
        ['string', 'uint256', 'string'],
        [manifest.name, manifest.version, manifest.author]
      ));
      const encoded = encodePluginManifest(manifest);
  
      // Call the installPlugin function on the JaySmartAccount contract.
      await expect(
        jaySmartAccount.installPlugin(
          basicPlugin.target,
          manifestHash,
          manifest,
          encoded,
          true
        )
      )
      // .to.be.revertedWith("Plugin version mismatch");
      .to.be.revertedWithCustomError(jaySmartAccount, "PluginVersionMismatch");
    });
  });

  describe("### Exponential Contract", function () {
    let exponential: any;
    let owner: any;
    const expScale = 1000000000000000000n;
  
    beforeEach(async () => {
      [owner] = await ethers.getSigners();
  
      // Deploy the Exponential contract
      exponential = await ethers.deployContract("Exponential");
    });
  
    it("should correctly compute getExp using (a/scale) / (b/scale) = a/b", async function () {
      const a = 10n;
      const b = 2n;
  
      // Expected result: a / b = 10 / 2 = 5
      const expectedMantissa = a / b * expScale;
  
      const [error, exp] = await exponential.getExp(a, b);
  
      expect(error).to.equal(0); // No error
      expect(exp.mantissa).to.equal(expectedMantissa); // a / b should be 5e18
    });
  
    it("should return zero mantissa for division by zero", async function () {
      const a = 10n;
      const b = 0; // Division by zero
  
      const [error, exp] = await exponential.getExp(a * expScale, b);
  
      expect(error).to.not.equal(0); // Should return an error
      expect(exp.mantissa).to.equal(0); // Should return zero mantissa
    });
  
    it("should correctly compute a fraction (3/4 = 0.75)", async function () {
      const a = 3n;
      const b = 4n;
  
      // Expected result: a / b = 3 / 4 = 0.75
      const expectedMantissa = (a * expScale * expScale) / b * expScale / expScale;
  
      const [error, exp] = await exponential.getExp(a * expScale, b);
  
      expect(error).to.equal(0);
      expect(exp.mantissa).to.equal(expectedMantissa); // 0.75e18
    });
  });

  describe("### PoolTerminal", function () {
    let poolTerminal: PoolTerminal;
    let deployer: SignerWithAddress;
    let user: SignerWithAddress;
  
    beforeEach(async function () {
      [deployer, user] = await ethers.getSigners();
      // Deploy using the new deployContract function. The deployer is provided as the third argument.
      poolTerminal = await ethers.deployContract("PoolTerminal", [10], deployer);
      await poolTerminal.waitForDeployment();
    });
  
    it("should deploy with the correct initial value", async function () {
      expect(await poolTerminal.get()).to.equal(10);
      expect(await poolTerminal.storedValue()).to.equal(10);
    });
  
    it("should update storedValue when set() is called", async function () {
      const tx = await poolTerminal.set(20);
      await expect(tx).to.emit(poolTerminal, "DataUpdated").withArgs(20);
      expect(await poolTerminal.get()).to.equal(20);
    });
  
    it("should call fullfillBasicOrder", async function () {
      const order = getBasicOrderParameters();
      console.log("order", order);
      
      // Call the function with a payable value (if required).
      const tx = await poolTerminal.fulfillBasicOrder(order, {
        value: ethers.parseEther("0.1"),
      });
  
      // Assert that the event BasicOrderFulfilled is emitted with the expected arguments.
      await expect(tx)
        .to.emit(poolTerminal, "BasicOrderFulfilled")
        .withArgs(deployer.address, true, 8);
    });
  });
  
});
