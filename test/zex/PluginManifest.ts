import { ethers } from 'ethers';

export interface PluginManifest {
  name: string;
  version: bigint;
  author: string;
  reserves: string[];
  interfaceIds: string[];
}

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

// Function to encode the PluginManifest to bytes
export function encodePluginManifest(manifest: Readonly<PluginManifest>): string {
  return abiCoder.encode(
    ["string", "uint256", "string", "bytes32[]", "bytes4[]"],
    [
      manifest.name, 
      manifest.version, 
      manifest.author, 
      manifest.reserves, 
      manifest.interfaceIds
    ]
  );
}
