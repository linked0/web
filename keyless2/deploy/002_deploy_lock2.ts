import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getAddress } from "../scripts/utils/helpers";

const deployBase: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const address = getAddress(hre);

  await deploy("Lock2", {
    from: deployer,
    args: [deployer, deployer, address.assets.weth],
    log: true,
  });
  const registry = await ethers.getContract("Registry");
};

export default deployBase;
deployBase.tags = ["Base"];