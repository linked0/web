import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

const deployLock2: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("###### deployer:", deployer)

  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

  await deploy("Lock2", {
    from: deployer,
    args: [unlockTime],
    log: true,
  });
};

export default deployLock2;
deployLock2.tags = ["Lock2"];