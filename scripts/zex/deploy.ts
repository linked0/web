import { ethers } from "hardhat";

async function main() {
  const [deployer, user] = await ethers.getSigners();

  const logic = await ethers.deployContract("JaySmartAccount");
  await logic.waitForDeployment();
  console.log(`JAY_SMART_ACCOUNT_CONTRACT=${logic.target}`);

  const basicPlugin = await ethers.deployContract("BasicPlugin");
  await basicPlugin.waitForDeployment();
  console.log(`BASIC_PLUGIN_CONTRACT=${basicPlugin.target}`);

  const JaySmartAccountF = await ethers.getContractFactory("JaySmartAccount");
  const initData = JaySmartAccountF.interface.encodeFunctionData(
    "initialize(uint256)",
    [1]
  );

  const proxy = await ethers.deployContract("JSAProxy", [
    logic.target,
    deployer.address,
    initData]);
  await proxy.waitForDeployment();
  console.log(`JSA_PROXY_CONTRACT=${proxy.target}`);

  const account = await ethers.getContractAt(
    "JaySmartAccount",      // name of your logic contract
    proxy.target.toString(),// proxy’s address
    user                    // signer
  );
  console.log("proxy.store =", await account.getStore());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
