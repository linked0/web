import { Wallet } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("AllBasic");
  const provider = ethers.provider;
  const dataStorage = await factory.attach(
    process.env.DATA_STORAGE_CONTRACT || ""
  );
  const adminWallet = new Wallet(process.env.ADMIN_KEY || "", provider);

  console.log("DATA_STORAGE_CONTRACT: ", await dataStorage.getAddress());

  await dataStorage.add();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
