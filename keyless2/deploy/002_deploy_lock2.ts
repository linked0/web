import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { getAddress } from "../scripts/utils/helpers";

const deployBase: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const address = getAddress(hre);

  const deployContract = await deploy("Lock2", {
    from: deployer,
    args: [deployer, deployer, address.assets.weth],
    log: true,
  });
  const lock2 = await ethers.getContract("Lock2");
};

export default deployBase;
deployBase.tags = ["Base"];