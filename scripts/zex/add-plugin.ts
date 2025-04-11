import { ethers } from 'hardhat';

import { encodePluginManifest, PluginManifest } from "../../test/zex/PluginManifest";
import { JaySmartAccount, BasicPlugin } from '../../typechain-types'; 

async function main() {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  const jsaAddress = process.env.JAY_SMART_ACCOUNT_CONTRACT;
  if (!jsaAddress) {
    throw new Error("JAY_SMART_ACCOUNT_CONTRACT environment variable not set.");
  }

  const basicPluginAddress = process.env.BASIC_PLUGIN_CONTRACT;
  if (!basicPluginAddress) {
    throw new Error("BASIC_PLUGIN_CONTRACT environment variable not set.");
  }

  const JSAFactory = await ethers.getContractFactory('JaySmartAccount');
  const jaySmartAccount = JSAFactory.attach(jsaAddress) as JaySmartAccount;

  const BasicPlusginFactory = await ethers.getContractFactory('BasicPlugin');
  const basicPlugin = BasicPlusginFactory.attach(basicPluginAddress) as BasicPlugin;

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
  console.log("manifestHash in add-plugin::", manifestHash);
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

  // Get the plugin address with getPluginAddress function.
  const pluginAddress = await jaySmartAccount.getPluginAddress(0);
  console.log("pluginAddress:", pluginAddress);

  // Get the plugin data with address
  const pluginData = await jaySmartAccount.getPluginData(pluginAddress);
  console.log("pluginData:", pluginData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);
