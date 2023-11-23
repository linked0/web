import { ethers } from "hardhat";
import { bytecode } from "../artifacts/contracts/Vault.sol/Vault.json";
import { encoder, create2Address } from "./utils";

async function main() {
  const unlockTime = "1693809900";
  const saltHex = ethers.utils.id("12345");
  const initCode = bytecode + encoder(["uint256"], [unlockTime]);

  const create2Addr = create2Address(process.env.FACTORY_CONTRACT ?? "", saltHex, initCode);
  console.log("precomputed address: ", create2Addr);

  const Factory = await ethers.getContractFactory("DeterministicDeployFactory");
  const factory = await Factory.attach(process.env.FACTORY_CONTRACT ?? "");

  const lockDeploy = await factory.deploy(initCode, saltHex);
  const txReceipt = await lockDeploy.wait();
  console.log("Deployed Vault at: ", txReceipt.events[0].args[0]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
