import { Wallet } from "ethers";
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../../artifacts/contracts/Greeter.sol/Greeter.json";

async function main() {
  const ContractFactory = await ethers.getContractFactory("Greeter");
  const contract = await ContractFactory.attach(process.env.GREETER_CONTRACT_L1 ?? "");

  const provider = ethers.provider;
  const wallet = new Wallet(process.env.ADMIN_KEY || "");
  const signer = provider.getSigner(wallet.address);

  const result = await contract.connect(signer).greet();
  console.log("greet:", result.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
