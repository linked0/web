import { ethers } from "hardhat";
import { Wallet } from "ethers";
import { NonceManager } from "@ethersproject/experimental";

async function main() {
  const provider = ethers.provider;
  const admin = new Wallet(process.env.ADMIN_KEY || "");
  const adminSigner = new NonceManager(provider.getSigner(admin.address));

  // deploy Greeter contract
  const Factory = await ethers.getContractFactory("Greeter");
  const contract = await Factory.connect(adminSigner).deploy("Hey Geun!");
  await contract.deployed();
  console.log("Deployed Greeter at: ", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
