import { ethers } from "hardhat";

async function main() {
  // Deploy MyToken and TransactionDelegator
  const mytoken = await ethers.deployContract("MyToken");
  await mytoken.waitForDeployment();
  console.log(`Deployed MINTABLE_TOKEN: ${mytoken.target}`);

  const delegator = await ethers.deployContract("TransactionDelegator", [
    mytoken.target,
  ]);
  await delegator.waitForDeployment();
  console.log(`Deployed TRANSACTION_DELEGATOR_CONTRACT: ${delegator.target}`);

  // PoohnetFund
  const poohentFundFactory = await ethers.getContractFactory("PoohnetFund");
  const provider = ethers.provider;
  const poohentFund = await poohentFundFactory.attach(
    process.env.POOHNET_FUND_CONTRACT_ADDRESS || ""
  );
  const adminWallet = new Wallet(process.env.ADMIN_KEY || "", provider);

  const fundBalance = await ethers.provider.getBalance(poohentFund.target);
  console.log("PoohentFund balance: ", fundBalance);
  const adminBalance = await ethers.provider.getBalance(adminWallet.address);
  console.log("Admin balance: ", adminBalance);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
