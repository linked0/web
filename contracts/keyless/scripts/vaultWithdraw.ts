import { ethers } from "hardhat";
import { BigNumber, Wallet } from "ethers";

async function main() {
  const provider = ethers.provider;
  const wallet = new Wallet(process.env.ADMIN_KEY || "");
  const signer = provider.getSigner(wallet.address);

  const Vault = await ethers.getContractFactory("Vault");
  const vaultContract = await Vault.attach(process.env.VAULT_CONTRACT ?? "");
  const signerVault = vaultContract.connect(signer);

  const receipt = await signerVault.withdraw();
  console.log("Withdraw receipt:", receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
