import { ethers } from 'hardhat';

import { encodePluginManifest, PluginManifest } from "../../test/zex/PluginManifest";
import { JaySmartAccountV2, BasicPlugin } from '../../typechain-types'; 

async function main() {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  const jsaAddress = process.env.JAY_SMART_ACCOUNT_CONTRACT_V2;
  if (!jsaAddress) {
    throw new Error("JAY_SMART_ACCOUNT_CONTRACT_V2 environment variable not set.");
  }

  const basicPluginAddress = process.env.BASIC_PLUGIN_CONTRACT;
  if (!basicPluginAddress) {
    throw new Error("BASIC_PLUGIN_CONTRACT environment variable not set.");
  }

  const JSAFactory = await ethers.getContractFactory('JaySmartAccountV2');
  const jaySmartAccount = JSAFactory.attach(jsaAddress) as JaySmartAccountV2;

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
  console.log("manifestHash in get-plugin:", manifestHash);
  const encoded = encodePluginManifest(manifest);

  // Get the plugin address with getPluginAddress function.
  const pluginAddress = await jaySmartAccount.getPluginAddress(0);
  console.log("pluginAddress:", pluginAddress);

  // Get the plugin data with address
  // const pluginData = await jaySmartAccount.getPluginData(pluginAddress);
  // console.log("pluginData:", pluginData);
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
