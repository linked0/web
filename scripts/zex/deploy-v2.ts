import { ethers } from "hardhat";

async function main() {
  const [deployer, user] = await ethers.getSigners();

  const logic = await ethers.deployContract("JaySmartAccountV2");
  await logic.waitForDeployment();
  console.log(`JAY_SMART_ACCOUNT_CONTRACT_V2=${logic.target}`);

  const proxyAddress = process.env.JSA_PROXY_CONTRACT;
  if (!proxyAddress) {
    throw new Error("✋ Missing JSA_PROXY_CONTRACT in your .env");
  }
  
  console.log("proxyAddress address:", proxyAddress); 
  const proxyContract = await ethers.getContractAt(
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol:ITransparentUpgradeableProxy",
    proxyAddress,           // proxy’s address
    deployer                // signer
  );

  proxyAddress && await proxyContract.upgradeTo(logic.target);

  const accountUser = await ethers.getContractAt(
    "JaySmartAccountV2",      // name of your logic contract
    proxyAddress,           // proxy’s address
    user                    // signer
  );
  console.log("proxy.store =", await accountUser.getStore());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
