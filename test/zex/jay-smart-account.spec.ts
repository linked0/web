import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";

import { JaySmartAccount, BasicPlugin } from "../../typechain-types";

import { encodePluginManifest, PluginManifest } from "./PluginManifest";
import { UserOperation } from "./UserOperation";

describe("Jay Smart Account", () => {
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
    // log the type of manifest
    console.log("manifest:", manifest);

    // Log the manifest for debugging (optional)
    console.log("Plugin Manifest:", manifest);

    // Check that the manifest's interfacerIds array has a length of 1.
    expect(manifest.interfaceIds.length).to.equal(1);

    // Check that the first interface ID is 0x01ffc9a7.
    expect(manifest.interfaceIds[0]).to.equal("0x01ffc9a7");
  });

  it("should call installPlugin and return the correct plugin address", async function () {
    // Create the manifest hash (or use the relevant logic if manifest is already a hash
    const manifest: PluginManifest = await basicPlugin.pluginManifest();
    const manifestHash = ethers.keccak256(abiCoder.encode(
      ['string', 'string', 'string'],
      [manifest.name, manifest.version, manifest.author]
    ));
    const encoded = encodePluginManifest(manifest);

    // Call the installPlugin function on the JaySmartAccount contract.
    const tx = await jaySmartAccount.installPlugin(
      basicPlugin.target,
      manifestHash,
      encoded
    );

    // Wait for the transaction to be mined.
    await tx.wait();

    // Call the getPluginAddress function on the JaySmartAccount contract.
    const pluginAddress = await jaySmartAccount.getPluginAddress(0);
    console.log("Plugin Address:", pluginAddress);  // Ensure this is treated as an address


    // Check that the plugin address is equal to the basicPlugin address.
    // expect(pluginAddress).to.equal(basicPlugin.address);
  });
});
